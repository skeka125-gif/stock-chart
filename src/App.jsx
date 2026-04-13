import { useState, useMemo } from "react";

const STOCKS = [
  {
    name: "엔비디아", ticker: "NVDA", color: "#76B900", startWeek: 1, firstPrice: 157.79,
    data: [
      {w:1,eval:175.51,avg:187.30,cur:181.51},{w:2,eval:187.96,avg:187.06,cur:174.83},{w:3,eval:215.00,avg:185.93,cur:180.80},
      {w:4,eval:246.87,avg:185.89,cur:190.33},{w:5,eval:264.77,avg:186.05,cur:188.65},{w:6,eval:278.68,avg:186.28,cur:184.67},
      {w:7,eval:301.01,avg:186.09,cur:186.03},{w:8,eval:324.15,avg:185.73,cur:187.48},{w:9,eval:350.21,avg:185.98,cur:190.93},
      {w:10,eval:360.00,avg:185.79,cur:185.22},{w:11,eval:373.96,avg:186.12,cur:182.64},{w:12,eval:408.83,avg:186.05,cur:189.82},
      {w:13,eval:399.92,avg:186.38,cur:177.19},{w:14,eval:421.01,avg:186.11,cur:177.82},{w:15,eval:446.66,avg:185.89,cur:180.25},
      {w:16,eval:446.40,avg:185.77,cur:172.58},{w:17,eval:452.18,avg:185.45,cur:167.52},{w:18,eval:499.49,avg:184.88,cur:177.39},{w:19,eval:552.06,avg:184.69,cur:188.63}
    ]
  },
  {
    name: "AMD", ticker: "AMD", color: "#ED1C24", startWeek: 1, firstPrice: 209.80,
    data: [
      {w:1,eval:68.90,avg:221.25,cur:217.84},{w:2,eval:85.60,avg:221.34,cur:210.57},{w:3,eval:106.96,avg:219.24,cur:213.22},
      {w:4,eval:127.72,avg:218.58,cur:214.78},{w:5,eval:153.52,avg:218.11,cur:223.24},{w:6,eval:158.25,avg:218.02,cur:202.98},
      {w:7,eval:202.61,avg:217.17,cur:231.60},{w:8,eval:249.10,avg:218.70,cur:259.43},{w:9,eval:245.62,avg:221.45,cur:236.50},
      {w:10,eval:234.59,avg:221.88,cur:208.23},{w:11,eval:252.58,avg:221.44,cur:207.12},{w:12,eval:263.92,avg:219.70,cur:200.15},
      {w:13,eval:283.59,avg:218.62,cur:200.21},{w:14,eval:292.42,avg:216.93,cur:192.43},{w:15,eval:313.26,avg:215.84,cur:193.39},
      {w:16,eval:343.15,avg:214.72,cur:199.35},{w:17,eval:366.75,avg:214.57,cur:201.99},{w:18,eval:415.92,avg:214.18,cur:217.50},{w:19,eval:490.14,avg:214.74,cur:245.04}
    ]
  },
  {
    name: "알파벳A", ticker: "GOOGL", color: "#4285F4", startWeek: 2, firstPrice: 320.70,
    data: [
      {w:2,eval:19.44,avg:317.77,cur:309.03},{w:3,eval:39.49,avg:310.79,cur:306.90},{w:4,eval:60.50,avg:310.51,cur:313.15},
      {w:5,eval:80.98,avg:311.02,cur:314.83},{w:6,eval:105.03,avg:312.52,cur:328.24},{w:7,eval:125.48,avg:315.28,cur:329.68},
      {w:8,eval:145.05,avg:316.16,cur:327.59},{w:9,eval:169.81,avg:318.17,cur:337.68},{w:10,eval:181.21,avg:320.35,cur:322.52},
      {w:11,eval:190.70,avg:320.38,cur:305.44},{w:12,eval:217.35,avg:318.50,cur:314.98},{w:13,eval:234.97,avg:318.11,cur:311.76},
      {w:14,eval:244.62,avg:316.97,cur:298.52},{w:15,eval:267.72,avg:315.82,cur:302.28},{w:16,eval:283.96,avg:315.27,cur:298.73},
      {w:17,eval:279.17,avg:314.14,cur:274.34},{w:18,eval:321.77,avg:312.20,cur:295.77},{w:19,eval:365.75,avg:311.93,cur:317.24}
    ]
  },
  {
    name: "SPY", ticker: "SPY", color: "#FFD700", startWeek: 1, firstPrice: 644.00,
    data: [
      {w:1,eval:204.38,avg:669.46,cur:684.33},{w:2,eval:223.31,avg:670.79,cur:681.07},{w:3,eval:242.91,avg:671.63,cur:679.91},
      {w:4,eval:266.49,avg:672.67,cur:689.62},{w:5,eval:283.61,avg:673.66,cur:682.49},{w:6,eval:308.23,avg:674.77,cur:693.39},
      {w:7,eval:327.15,avg:675.74,cur:690.97},{w:8,eval:346.21,avg:676.07,cur:688.54},{w:9,eval:367.48,avg:677.10,cur:691.28},
      {w:10,eval:386.72,avg:677.84,cur:689.93},{w:11,eval:401.39,avg:678.42,cur:680.99},{w:12,eval:426.09,avg:678.79,cur:689.43},
      {w:13,eval:443.85,avg:679.26,cur:685.99},{w:14,eval:454.76,avg:679.35,cur:672.38},{w:15,eval:467.67,avg:678.98,cur:662.29},
      {w:16,eval:475.73,avg:678.60,cur:646.40},{w:17,eval:485.91,avg:677.81,cur:634.09},{w:18,eval:522.87,avg:676.55,cur:655.83},{w:19,eval:562.08,avg:676.18,cur:679.46}
    ]
  },
  {
    name: "QQQ", ticker: "QQQ", color: "#FF6B35", startWeek: 2, firstPrice: 624.13,
    data: [
      {w:2,eval:9.83,avg:623.56,cur:613.57},{w:3,eval:30.01,avg:616.17,cur:616.37},{w:4,eval:50.42,avg:618.00,cur:623.19},
      {w:5,eval:69.33,avg:618.25,cur:612.50},{w:6,eval:91.00,avg:619.14,cur:626.02},{w:7,eval:110.17,avg:619.65,cur:620.61},
      {w:8,eval:130.79,avg:618.26,cur:622.06},{w:9,eval:150.32,avg:619.92,cur:621.25},{w:10,eval:167.08,avg:619.62,cur:609.05},
      {w:11,eval:184.58,avg:618.72,cur:601.24},{w:12,eval:206.93,avg:617.22,cur:608.81},{w:13,eval:226.33,avg:616.50,cur:607.29},
      {w:14,eval:243.36,avg:615.47,cur:599.75},{w:15,eval:260.63,avg:614.41,cur:593.72},{w:16,eval:273.28,avg:613.53,cur:578.75},
      {w:17,eval:284.67,avg:611.99,cur:562.58},{w:18,eval:316.41,avg:609.47,cur:584.98},{w:19,eval:350.95,avg:608.77,cur:611.07}
    ]
  },
  {
    name: "SOXX", ticker: "SOXX", color: "#00D4AA", startWeek: 2, firstPrice: 311.86,
    data: [
      {w:2,eval:9.57,avg:312.42,cur:299.29},{w:3,eval:29.66,avg:302.93,cur:299.60},{w:4,eval:50.32,avg:303.76,cur:305.71},
      {w:5,eval:72.17,avg:303.96,cur:313.38},{w:6,eval:96.03,avg:307.83,cur:328.45},{w:7,eval:120.85,avg:311.40,cur:342.12},
      {w:8,eval:141.80,avg:315.67,cur:344.35},{w:9,eval:162.05,avg:320.23,cur:345.96},{w:10,eval:183.19,avg:323.09,cur:348.16},
      {w:11,eval:206.35,avg:326.21,cur:354.30},{w:12,eval:229.44,avg:328.65,cur:359.43},{w:13,eval:244.24,avg:331.41,cur:352.29},
      {w:14,eval:243.17,avg:332.26,cur:323.51},{w:15,eval:269.10,avg:332.09,cur:331.32},{w:16,eval:287.32,avg:332.67,cur:330.00},
      {w:17,eval:300.55,avg:333.30,cur:323.48},{w:18,eval:336.22,avg:332.98,cur:339.61},{w:19,eval:404.42,avg:334.23,cur:386.60}
    ]
  },
  {
    name: "BITX", ticker: "BITX", color: "#F7931A", startWeek: 7, firstPrice: 29.89,
    data: [
      {w:7,eval:20.72,avg:31.46,cur:32.61},{w:8,eval:37.65,avg:30.09,cur:28.34},{w:9,eval:50.54,avg:29.37,cur:24.74},
      {w:10,eval:49.76,avg:26.56,cur:16.53},{w:11,eval:67.85,avg:23.33,cur:15.83},{w:12,eval:86.15,avg:21.37,cur:15.36},
      {w:13,eval:99.46,avg:20.03,cur:14.25},{w:14,eval:124.85,avg:19.36,cur:15.13},{w:15,eval:156.84,avg:18.90,cur:16.49},
      {w:16,eval:158.83,avg:18.74,cur:14.90},{w:17,eval:165.96,avg:18.51,cur:13.98},{w:18,eval:190.25,avg:18.13,cur:14.39},{w:19,eval:248.00,avg:17.94,cur:17.13}
    ]
  },
  {
    name: "KRX금현물", ticker: "KRX금", color: "#FFE066", startWeek: 1, isKR: true, firstPrice: 25385,
    data: [
      {w:1,eval:365943,avg:27112,cur:28149},{w:2,eval:427643,avg:27242,cur:28510},{w:3,eval:492909,avg:27431,cur:28995},
      {w:4,eval:570742,avg:27677,cur:30039},{w:5,eval:615072,avg:27821,cur:29289},{w:6,eval:676757,avg:27977,cur:29424},
      {w:7,eval:767357,avg:28178,cur:30694},{w:8,eval:887607,avg:28434,cur:32874},{w:9,eval:1027742,avg:28832,cur:35439},
      {w:10,eval:1008412,avg:29159,cur:32529},{w:11,eval:1069842,avg:29417,cur:32419},{w:12,eval:1150257,avg:29589,cur:32865},
      {w:13,eval:1240592,avg:29802,cur:33530},{w:14,eval:1319352,avg:30049,cur:33830},{w:15,eval:1391932,avg:30235,cur:33950},
      {w:16,eval:1298152,avg:30376,cur:30185},{w:17,eval:1364607,avg:30369,cur:30325},{w:18,eval:1490587,avg:30401,cur:31715},{w:19,eval:1553527,avg:30454,cur:31705}
    ]
  }
];

const MAX_WEEK = 19;
const WEEK_FX = {
  1:1400, 2:1400, 3:1400, 4:1400, 5:1400, 6:1400, 7:1400, 8:1400, 9:1400,
  10:1400, 11:1400, 12:1400, 13:1400, 14:1400, 15:1400, 16:1400, 17:1400, 18:1400,
  19:1450
};
const WEEKS = Array.from({length: MAX_WEEK}, (_, i) => i + 1);
const WEEK_DATES = {
  1:"12/06", 2:"12/14", 3:"12/20", 4:"12/28",
  5:"1/04",  6:"1/11",  7:"1/17",  8:"1/25",
  9:"2/01",  10:"2/08", 11:"2/15", 12:"2/21",
  13:"3/01", 14:"3/08", 15:"3/16", 16:"3/22",
  17:"3/29", 18:"4/05", 19:"4/11"
};

const MODE_INFO = {
  cumReturn:  { label: "누적 등락률",   desc: "첫 매수가 기준 종목 자체 등락률 (%)" },
  evalUSD:    { label: "평가금액 ($)",   desc: "보유 평가금액 (국내주식 ₩1,400/$ 환산)" },
  gapRate:    { label: "괴리율",         desc: "현재가 vs 평단가 차이 (%) — 마이너스 구간이 추매 기회였던 시점" },
  normalized: { label: "정규화 (첫주=100)", desc: "각 종목 첫 등장 주차 평단가를 100으로 놓은 상대 변화 — 종목 간 평단가 추이 비교" },
};

export default function StockChart() {
  const [mode, setMode] = useState("cumReturn");
  const [enabled, setEnabled] = useState(Object.fromEntries(STOCKS.map(s => [s.ticker, true])));
  const toggle = t => setEnabled(p => ({...p, [t]: !p[t]}));

  const chartData = useMemo(() => {
    return STOCKS.filter(s => enabled[s.ticker]).map(stock => {
      const firstAvg = stock.data[0].avg; // 정규화용 첫 주차 평단가
      const points = stock.data.map(d => {
        let val;
        if (mode === "evalUSD")
          val = stock.isKR ? d.eval / (WEEK_FX[d.w] || 1400) : d.eval;
        else if (mode === "cumReturn")
          val = ((d.cur - stock.firstPrice) / stock.firstPrice) * 100;
        else if (mode === "gapRate")
          val = ((d.cur - d.avg) / d.avg) * 100;
        else if (mode === "normalized")
          val = (d.avg / firstAvg) * 100;
        return { week: d.w, value: val };
      });
      return { ...stock, points };
    });
  }, [mode, enabled]);

  const allV = chartData.flatMap(s => s.points.map(p => p.value));
  const rawMin = allV.length ? Math.min(...allV) : -10;
  const rawMax = allV.length ? Math.max(...allV) : 10;
  const pad = (rawMax - rawMin) * 0.08 || 5;
  const yMin = rawMin - pad, yMax = rawMax + pad;

  const cW = 960, cH = 480, pL = 72, pR = 165, pT = 20, pB = 44;
  const plotW = cW - pL - pR, plotH = cH - pT - pB;
  const xS = w => pL + ((w - 1) / (MAX_WEEK - 1)) * plotW;
  const yS = v => pT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const gridLines = useMemo(() => {
    const range = yMax - yMin;
    let step;
    if (mode === "cumReturn" || mode === "gapRate") step = range > 80 ? 10 : range > 40 ? 5 : 2;
    else if (mode === "normalized") step = range > 40 ? 10 : 5;
    else step = range > 500 ? 100 : range > 200 ? 50 : 25;
    const lines = [];
    for (let v = Math.ceil(yMin / step) * step; v <= yMax; v += step) lines.push(+(v.toFixed(4)));
    return lines;
  }, [yMin, yMax, mode]);

  const fmtVal = v => {
    if (mode === "evalUSD") return `$${v.toFixed(0)}`;
    if (mode === "normalized") return `${v.toFixed(0)}`;
    return `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`;
  };
  const fmtGrid = v => {
    if (mode === "evalUSD") return `$${v.toFixed(0)}`;
    if (mode === "normalized") return `${v.toFixed(0)}`;
    return `${v >= 0 ? '+' : ''}${v.toFixed(0)}%`;
  };

  // 0선 표시 여부 (괴리율, 누적등락률)
  const showZeroLine = mode === "cumReturn" || mode === "gapRate";

  const endLabels = useMemo(() => {
    const labels = chartData.map(s => {
      const last = s.points[s.points.length - 1];
      return {
        ticker: s.ticker, name: s.name, color: s.color,
        x: xS(last.week), rawY: yS(last.value), y: yS(last.value), value: last.value
      };
    }).sort((a, b) => a.rawY - b.rawY);
    for (let i = 1; i < labels.length; i++) {
      if (labels[i].y - labels[i - 1].y < 16) labels[i].y = labels[i - 1].y + 16;
    }
    return labels;
  }, [chartData]);

  return (
    <div style={{
      background: "#0a0a14", color: "#e0e0e0", minHeight: "100vh",
      fontFamily: "'Pretendard','Noto Sans KR',sans-serif", padding: "20px 16px"
    }}>
      <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" rel="stylesheet"/>

      <h1 style={{
        fontSize: "26px", fontWeight: 800, textAlign: "center",
        background: "linear-gradient(135deg,#3B82F6,#00D4AA)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        marginBottom: "4px", letterSpacing: "-0.5px"
      }}>주식 모으기 추적 차트</h1>
      <p style={{textAlign: "center", color: "#c0c8d8", fontSize: "13px", marginBottom: "16px"}}>
        1주차 ~ {MAX_WEEK}주차 · 국내주식 주차별 환율 적용
      </p>

      {/* 모드 버튼 */}
      <div style={{display: "flex", justifyContent: "center", gap: "6px", marginBottom: "8px", flexWrap: "wrap"}}>
        {Object.entries(MODE_INFO).map(([m, info]) => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: "7px 16px", borderRadius: "20px", border: "none", cursor: "pointer",
            fontSize: "13px", fontWeight: 700, transition: "all 0.2s",
            background: mode === m ? "#3B82F6" : "#16162a",
            color: mode === m ? "#fff" : "#6b7280",
            boxShadow: mode === m ? "0 0 16px rgba(59,130,246,0.3)" : "none"
          }}>{info.label}</button>
        ))}
      </div>

      {/* 현재 모드 설명 */}
      <p style={{textAlign: "center", color: "#b0bccf", fontSize: "12px", marginBottom: "14px", minHeight: "16px"}}>
        {MODE_INFO[mode].desc}
      </p>

      {/* 종목 토글 */}
      <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "5px", marginBottom: "18px"}}>
        {STOCKS.map(s => (
          <button key={s.ticker} onClick={() => toggle(s.ticker)} style={{
            padding: "4px 12px", borderRadius: "14px",
            border: `1.5px solid ${enabled[s.ticker] ? s.color : '#333'}`,
            cursor: "pointer", fontSize: "12px", fontWeight: 700, transition: "all 0.15s",
            background: enabled[s.ticker] ? s.color + "18" : "transparent",
            color: enabled[s.ticker] ? s.color : "#444"
          }}>{s.name}</button>
        ))}
      </div>

      {/* 차트 */}
      <div style={{display: "flex", justifyContent: "center", overflowX: "auto"}}>
        <svg width={cW} height={cH} style={{background: "#0e0e1c", borderRadius: "10px", border: "1px solid #1a1a2e"}}>
          {/* 그리드 */}
          {gridLines.map(v => (
            <g key={v}>
              <line
                x1={pL} y1={yS(v)} x2={cW - pR} y2={yS(v)}
                stroke={showZeroLine && v === 0 ? "#3a3a5a" : "#151525"}
                strokeWidth={showZeroLine && v === 0 ? 1.5 : 0.5}
              />
              <text x={pL - 8} y={yS(v) + 4} textAnchor="end" fill="#9aaabb" fontSize="10" fontFamily="monospace">
                {fmtGrid(v)}
              </text>
            </g>
          ))}

          {/* 괴리율 0선 강조 영역 */}
          {mode === "gapRate" && yMin < 0 && yMax > 0 && (
            <rect
              x={pL} y={yS(0)} width={plotW} height={yS(yMin) - yS(0)}
              fill="#1a0a0a" opacity="0.4"
            />
          )}

          {/* x축 날짜 */}
          {WEEKS.map(w => (
            <text key={w} x={xS(w)} y={cH - 12} textAnchor="middle" fill="#9aaabb" fontSize="9" fontFamily="monospace">
              {WEEK_DATES[w]}
            </text>
          ))}

          {/* 라인 */}
          {chartData.map(stock => {
            const pts = stock.points;
            if (pts.length < 2) return null;
            const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xS(p.week)} ${yS(p.value)}`).join(' ');
            return (
              <path key={stock.ticker} d={d} fill="none" stroke={stock.color}
                strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" opacity="0.9"/>
            );
          })}

          {/* 끝 라벨 */}
          {endLabels.map(l => (
            <g key={l.ticker}>
              {Math.abs(l.y - l.rawY) > 4 && (
                <line x1={l.x + 2} y1={l.rawY} x2={l.x + 10} y2={l.y}
                  stroke={l.color} strokeWidth="0.5" opacity="0.5"/>
              )}
              <text x={l.x + 12} y={l.y + 4} fill={l.color} fontSize="11" fontWeight="700"
                fontFamily="'Pretendard',sans-serif">
                {l.name} {fmtVal(l.value)}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <p style={{textAlign: "center", color: "#8899aa", fontSize: "11px", marginTop: "14px"}}>
        괴리율 = (현재가 − 평단가) / 평단가 × 100 · 정규화 = 첫 등장 주차 평단가 기준 100 · 평가금액 환산: 주차별 환율 적용
      </p>
    </div>
  );
}
