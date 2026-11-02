#!/usr/bin/env python3
"""주식 모으기 주간 생성기
사용법:  python tools/stock_weekly.py data/week_49.json   (stock-chart 폴더에서 실행)
입력   :  앱 사진에서 옮긴 숫자(data/week_NN.json) + 직전 주차 data/week_(NN-1).json + 현재 차트 src/App.jsx
출력   :  src/App.jsx 에 NN주차 추가(직접 수정) / out/주식모으기_NN주차.png / out/보고_NN주차.md
"""
import sys, os, re, json, argparse
from PIL import Image, ImageDraw, ImageFont

# ───────── 설정 ─────────
CREDIT = "전잔도 생성: Claude Sonnet 5.5 (claude-sonnet-5-5)"
FONT_R_CANDIDATES = ["/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    "C:/Windows/Fonts/NotoSansCJKkr-Regular.otf", "C:/Windows/Fonts/malgun.ttf",
    "/System/Library/Fonts/AppleSDGothicNeo.ttc"]
FONT_B_CANDIDATES = ["/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
    "C:/Windows/Fonts/NotoSansCJKkr-Bold.otf", "C:/Windows/Fonts/malgunbd.ttf",
    "/System/Library/Fonts/AppleSDGothicNeo.ttc"]
NAMES = {"NVDA":"엔비디아 (NVDA)","AMD":"AMD","GOOGL":"알파벳 A (GOOGL)","MU":"마이크론 (MU)",
         "SPY":"SPY (S&P500)","QQQ":"QQQ (나스닥100)","SOXX":"SOXX (미국반도체)","DRAM":"DRAM"}
ORDER = ["NVDA","AMD","GOOGL","MU","SPY","QQQ","SOXX","DRAM"]   # 현황표 행 순서
KRX_FIRST = 25385   # KRX금현물 첫매수주가
RULE = "매수 주기: 월/수/금  |  금현물: 월요일 1주  |  해외주식: 각 $4 (8종목)  |  주간 합계: 국장 1주 + 미장 $96"
FOOT = "평단가 수익률 = 앱 수익률  |  누적등락률 = 첫 매수일 기준 종목 자체 등락률  |  마이크론(MU) 29주차부터 편입"

def pick_font(cands, size):
    for p in cands:
        if os.path.exists(p): return ImageFont.truetype(p, size)
    raise SystemExit("한글 글꼴을 찾지 못했습니다. FONT_*_CANDIDATES 에 글꼴 경로를 추가하세요.")
def fR(s): return pick_font(FONT_R_CANDIDATES, s)
def fB(s): return pick_font(FONT_B_CANDIDATES, s)

# ───────── 공통 계산 ─────────
def pct(v): return f"+{v:.1f}%" if v >= 0.05 else (f"{v:.1f}%" if v <= -0.05 else "+0.0%")
def usd(v): return f"${v:,.2f}"
def num(s): return float(s.replace("%","").replace("+",""))

def port(d):
    """차트 기준 포트폴리오 평가금액 / 투입 원가 (원화, 정수 환율)"""
    fx = round(d["fx"])
    P = sum(s["eval"] for s in d["stocks"]) * fx + d["krx"]["eval"]
    C = sum(s["avg"]*float(s["qty"]) for s in d["stocks"]) * fx + d["krx"]["avg"]*d["krx"]["qty"]
    return round(P), round(C)

# ───────── 현황표 PNG ─────────
W=1200
BG=(15,15,26); BORDER=(30,30,58); HEAD=(22,22,42); SEC=(26,26,48); COL=(17,17,40)
ROWA=(18,18,42); ROWB=(22,22,42); TEAL_BG=(13,30,30); CRED=(13,13,31)
CDIM=(107,117,133); TXT=(200,208,224); TEAL=(77,217,192); GREEN=(72,200,130); RED=(220,80,80)
YEL=(245,197,66); ORG=(245,158,11); ORG_DIM=(190,115,25); TITLE=(232,234,246)
CENT=[303,418,528,633,743,853,948,1028,1108]
HDR=["보유수량","평가금액","평단가","첫매수주가","이전주차","이번주차","평단가\n수익률","누적\n등락률","주간\n등락률"]
def cv(v): return GREEN if v.startswith("+") else (RED if v.startswith("-") else TXT)

def render(path,title,date,us,kr,rule2,foot1,foot2):
    nus,nkr=len(us),len(kr)
    us_top=120; us_bot=us_top+80+38*nus-1
    kr_top=us_bot+29; kr_bot=kr_top+80+38*nkr-1
    rule_top=kr_bot+29; rule_bot=rule_top+70
    cr_top=rule_bot+16; cr_bot=cr_top+60
    img=Image.new("RGB",(W,cr_bot+12),BG); d=ImageDraw.Draw(img)
    def card(y0,y1,fill,r=10):
        d.rounded_rectangle([28,y0,1171,y1],radius=r,fill=BORDER)
        d.rounded_rectangle([29,y0+1,1170,y1-1],radius=r-1,fill=fill)
    def ctext(x,y,s,f,c): d.text((x,y),s,font=f,fill=c,anchor="mm")
    card(28,104,HEAD)
    ctext(600,56,title,fB(28),TITLE)
    ctext(600,85,f"작성일: {date}  |  매주 월/수/금 적립 매수",fR(13),(107,117,133))
    def section(top,name,rows,bgfn,colfn):
        card(top,top+44,SEC); d.text((46,top+22),name,font=fB(16),fill=(224,232,255),anchor="lm")
        bot=top+80+38*len(rows)-1
        d.rounded_rectangle([28,top+44,1171,bot],radius=10,fill=BORDER)
        d.rounded_rectangle([29,top+45,1170,top+79],radius=9,fill=COL)
        d.rectangle([29,top+60,1170,top+79],fill=COL)
        ctext(138,top+62,"종목명",fR(11),CDIM)
        for i,l in enumerate(HDR):
            ls=l.split("\n")
            if len(ls)==2: ctext(CENT[i],top+54,ls[0],fR(10),CDIM); ctext(CENT[i],top+68,ls[1],fR(10),CDIM)
            else: ctext(CENT[i],top+62,l,fR(11),CDIM)
        for r,row in enumerate(rows):
            y=top+80+38*r
            d.rectangle([29,y,1170,y+36],fill=bgfn(r)); d.rectangle([29,y+37,1170,y+37],fill=BORDER)
            name,ncol=row[0]; d.text((38,y+19),name,font=fB(13),fill=ncol,anchor="lm")
            for i in range(9): ctext(CENT[i],y+19,row[i+1],fR(12),colfn(r,i,row[i+1]))
    def uscol(r,i,s): return YEL if i==3 else (cv(s) if i>=6 else TXT)
    section(us_top,"[US] 해외주식",us,lambda r:ROWA if r%2==0 else ROWB,uscol)
    def krcol(r,i,s):
        if i==3 and s!="-": return YEL
        if i>=6 or s=="-":
            return ORG_DIM if (r==3 and s=="-" and i in (4,5)) else cv(s)
        return TXT
    section(kr_top,"[KR] 국내주식  |  지수 참고",kr,lambda r:ROWA if r==0 else TEAL_BG,krcol)
    card(rule_top,rule_bot,HEAD)
    d.text((46,rule_top+19),"매수 규칙",font=fB(15),fill=TXT,anchor="lm")
    d.text((46,rule_top+42),rule2,font=fR(13),fill=(96,105,122),anchor="lm")
    card(cr_top,cr_bot,CRED)
    ctext(600,cr_top+16,foot1,fR(12),(91,99,115)); ctext(600,cr_top+40,foot2,fR(11),(62,62,95))
    img.save(path)

def make_png(cur, prev, firsts, out):
    pv={s["ticker"]:s for s in prev["stocks"]}
    bt={s["ticker"]:s for s in cur["stocks"]}
    us=[]
    for t in ORDER:
        s=bt[t]; f=firsts[t]; p=pv[t]["cur"]; c=s["cur"]
        us.append([(NAMES[t],TXT),str(s["qty"]),usd(s["eval"]),usd(s["avg"]),usd(f),usd(p),usd(c),
                   s["rate"],pct((c/f-1)*100),pct((c/p-1)*100)])
    k=cur["krx"]; pk=prev["krx"]
    kr=[[("ACE KRX금현물",TXT),str(k["qty"]),f"{k['eval']:,}원",f"{k['avg']:,}원",f"{KRX_FIRST:,}원",f"{pk['cur']:,}원",f"{k['cur']:,}원",
          k["rate"],pct((k["cur"]/KRX_FIRST-1)*100),pct((k["cur"]/pk["cur"]-1)*100)],
        [("코스피 (지수)",TEAL),"-","-","-","-",f"{prev['kospi']:,.2f}",f"{cur['kospi']:,.2f}","-","-",pct((cur['kospi']/prev['kospi']-1)*100)],
        [("코스닥 (지수)",TEAL),"-","-","-","-",f"{prev['kosdaq']:,.2f}",f"{cur['kosdaq']:,.2f}","-","-",pct((cur['kosdaq']/prev['kosdaq']-1)*100)],
        [("청년미래적금",ORG),"-",f"{cur['savings']:,}원","-","-","-","-","-","-","+30만/월"]]
    render(out,f"주식 모으기 {cur['week']}주차 현황표",cur["date"],us,kr,RULE,FOOT,CREDIT)

# ───────── 차트 JSX ─────────
def first_prices(jsx):
    f={}
    for m in re.finditer(r'ticker: "([^"]+)".*?firstPrice: ([\d.]+)',jsx):
        f[m.group(1)]=float(m.group(2))
    return f

def make_jsx(cur, base_path, out):
    src=open(base_path,encoding="utf-8").read(); n=cur["week"]; pw=n-1
    if f"MAX_WEEK = {pw};" not in src: raise SystemExit(f"기준 차트가 {pw}주차가 아닙니다: {base_path}")
    out_s=src; fx=round(cur["fx"])
    rows={s["ticker"]:(s["eval"],s["avg"],s["cur"]) for s in cur["stocks"]}
    rows["KRX금"]=(cur["krx"]["eval"],cur["krx"]["avg"],cur["krx"]["cur"])
    for t,(ev,avg,c) in rows.items():
        m=re.search(r'(ticker: "%s".*?\{w:%d,eval:[\d.]+,avg:[\d.]+,cur:[\d.]+\})'%(re.escape(t),pw),out_s,re.S)
        if not m: raise SystemExit(f"{t}: {pw}주차 데이터를 찾지 못했습니다")
        f=(lambda x:f"{int(x)}") if t=="KRX금" else (lambda x:f"{x:.2f}")
        out_s=out_s[:m.end()]+f",{{w:{n},eval:{f(ev)},avg:{f(avg)},cur:{f(c)}}}"+out_s[m.end():]
    out_s=re.sub(r'const VERSION = "v\d+\.\d+";',f'const VERSION = "v{n}.1";',out_s)
    out_s=re.sub(r'const MAX_WEEK = \d+;',f'const MAX_WEEK = {n};',out_s)
    def append_before(pattern, add):
        nonlocal out_s
        m=re.search(pattern,out_s,re.S); assert m,pattern
        out_s=out_s[:m.end(1)]+add+out_s[m.end(1):]
    append_before(r'(WEEK_FX = \{.*?)(\n\};)',f", {n}:{fx}")
    append_before(r'(WEEK_DATES = \{.*?)(\n\};)',f', {n}:"{cur["chart_date"]}"')
    out_s,c1=re.subn(r'(KOSPI: \[.*?)(\],)',lambda m:m.group(1)+f",{{w:{n},cur:{cur['kospi']}}}"+m.group(2),out_s,count=1,flags=re.S)
    out_s,c2=re.subn(r'(KOSDAQ: \[.*?)(\],)',lambda m:m.group(1)+f",{{w:{n},cur:{cur['kosdaq']}}}"+m.group(2),out_s,count=1,flags=re.S)
    assert c1 and c2
    P,C=port(cur)
    append_before(r'(PORTFOLIO_KRW = \[.*?)(\n\];)',f", {P}")
    append_before(r'(SAVINGS_KRW = \[.*?)(\n\];)',f", {C}")
    open(out,"w",encoding="utf-8").write(out_s)

# ───────── 주간 보고 ─────────
def make_report(cur, prev, out):
    n=cur["week"]; pv={s["ticker"]:s for s in prev["stocks"]}
    rows=[]
    for s in cur["stocks"]:
        p=pv[s["ticker"]]; rows.append((NAMES[s["ticker"]].split(" (")[0] if s["ticker"] not in ("SPY","QQQ","SOXX","AMD","DRAM") else s["ticker"],
            p["rate"],s["rate"],(s["cur"]/p["cur"]-1)*100))
    k=cur["krx"]; pk=prev["krx"]; rows.append(("ACE KRX금현물",pk["rate"],k["rate"],(k["cur"]/pk["cur"]-1)*100))
    rows.sort(key=lambda r:-num(r[2]))
    P,C=port(cur); pP,pC=port(prev)
    L=[f"## {n}주차 보고 (평단가 수익률 중심)",""]
    if cur.get("app_total"): L.append(f"앱 기준 총 수익은 {cur['app_total']}"+(f"로, 지난주 {prev['app_total']}에서 변했습니다." if prev.get("app_total") else "입니다.")+f" 환율은 {cur['fx']:,}원입니다.\n")
    L+=["| 종목 | 평단가 수익률 (지난주 → 이번주) | 주간 등락 |","|---|---|---|"]
    for name,a,b,w in rows: L.append(f"| {name} | {a} → **{b}** | {pct(w)} |")
    neg=[r[0] for r in rows if num(r[2])<0]
    turned=[r[0] for r in rows if num(r[1])>=0 and num(r[2])<0]
    recov=[r[0] for r in rows if num(r[1])<0 and num(r[2])>=0]
    best=max(rows,key=lambda r:r[3]); worst=min(rows,key=lambda r:r[3])
    L+=["",f"- **마이너스 종목:** {', '.join(neg) if neg else '없음'} ({len(neg)}개)"]
    if turned: L.append(f"- **마이너스 전환:** {', '.join(turned)}")
    if recov: L.append(f"- **플러스 복귀:** {', '.join(recov)}")
    L.append(f"- **주간 최대 상승/하락:** {best[0]} {pct(best[3])} / {worst[0]} {pct(worst[3])}")
    L.append(f"- **지수:** 코스피 {pct((cur['kospi']/prev['kospi']-1)*100)}, 코스닥 {pct((cur['kosdaq']/prev['kosdaq']-1)*100)}")
    L.append(f"- **차트 기준 포트폴리오:** 평가금액 {P:,}원, 투입 원가 {C:,}원, 손익 {(P/C-1)*100:+.1f}% (지난주 {(pP/pC-1)*100:+.1f}%). 원가는 현재 환율 환산이라 실제 투입액보다 작게 나옵니다.")
    L.append(f"- **청년미래적금:** {cur['savings']:,}원"+(" (변동 없음)" if cur['savings']==prev['savings'] else f" (지난주 {prev['savings']:,}원)"))
    L+=["","## 차트 적용법","src/App.jsx 는 이미 수정되었습니다. 올리기만 하면 됩니다.","```","cd Desktop\\stock-chart","git add .",f'git commit -m "{n}주차 업데이트"',"git push","```"]
    open(out,"w",encoding="utf-8").write("\n".join(L)+"\n")

# ───────── 실행 ─────────
def main():
    ap=argparse.ArgumentParser(); ap.add_argument("data"); ap.add_argument("--prev"); ap.add_argument("--base"); ap.add_argument("--outdir")
    a=ap.parse_args()
    folder=os.path.dirname(os.path.abspath(a.data)); cur=json.load(open(a.data,encoding="utf-8")); n=cur["week"]
    prev_path=a.prev or os.path.join(folder,f"week_{n-1}.json")
    if not os.path.exists(prev_path): raise SystemExit(f"직전 주차 입력 파일이 없습니다: {prev_path}")
    prev=json.load(open(prev_path,encoding="utf-8"))
    root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # stock-chart 폴더
    base=a.base or os.path.join(root,"src","App.jsx")
    if not os.path.exists(base): raise SystemExit(f"차트 파일이 없습니다: {base}")
    outdir=a.outdir or os.path.join(root,"out"); os.makedirs(outdir,exist_ok=True)
    firsts=first_prices(open(base,encoding="utf-8").read())
    png=os.path.join(outdir,f"주식모으기_{n}주차.png"); rep=os.path.join(outdir,f"보고_{n}주차.md")
    make_jsx(cur,base,base)   # 직전 주차가 아니면 여기서 멈추고 아무 파일도 바꾸지 않음
    make_png(cur,prev,firsts,png); make_report(cur,prev,rep)
    print("생성 완료:",base,png,rep,sep="\n  ")
if __name__=="__main__": main()
