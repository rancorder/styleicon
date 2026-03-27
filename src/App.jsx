import { useState, useEffect, useRef } from 'react'

const C = {
  bg:'#0a0908', surface:'#111009', card:'#18160f', border:'#2a2418',
  gold:'#c4973e', goldDim:'#8a6828', text:'#f0ead9', textMid:'#a09070', textDim:'#504838',
  pBg:'#0d0c0a', pSurface:'#181614', pBorder:'#2a2520', pGreen:'#22c55e', pRed:'#ef4444',
}
const FG="'Cormorant Garamond', serif"
const FB="'Noto Sans JP', sans-serif"
const FM="'DM Mono', monospace"
const CHANNEL='styleicon-brand-sync'

function useSyncSend(){
  const ch=useRef(null);const ready=useRef(false)
  useEffect(()=>{
    if(typeof window==='undefined'||!window.BroadcastChannel)return
    try{ch.current=new BroadcastChannel(CHANNEL);ready.current=true}catch(e){}
    return()=>{try{ch.current?.close()}catch(e){};ready.current=false}
  },[])
  const send=useRef((id)=>{
    if(!ready.current||!ch.current)return
    try{if(ready.current)ch.current.postMessage({sectionId:id});else setTimeout(()=>ch.current?.postMessage({sectionId:id}),150)}catch(e){}
  })
  return send.current
}
function useSyncReceive(onSection){
  useEffect(()=>{
    if(typeof window==='undefined'||!window.BroadcastChannel)return
    let ch
    try{ch=new BroadcastChannel(CHANNEL);ch.onmessage=(e)=>{if(e.data?.sectionId)onSection(e.data.sectionId)}}catch(e){}
    return()=>{try{ch?.close()}catch(e){}}
  },[onSection])
}
function useElapsedTimer(){
  const[elapsed,setElapsed]=useState(0);const startRef=useRef(Date.now())
  useEffect(()=>{const t=setInterval(()=>setElapsed(Math.floor((Date.now()-startRef.current)/1000)),1000);return()=>clearInterval(t)},[])
  const mm=String(Math.floor(elapsed/60)).padStart(2,'0');const ss=String(elapsed%60).padStart(2,'0')
  return{str:`${mm}:${ss}`,over:elapsed>1200}
}
function useFadeIn(){
  const ref=useRef(null);const[visible,setVisible]=useState(false)
  useEffect(()=>{const el=ref.current;if(!el)return;const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setVisible(true);obs.disconnect()}},{threshold:0.08});obs.observe(el);return()=>obs.disconnect()},[])
  return[ref,visible]
}
function FI({children,delay=0,style={}}){
  const[ref,vis]=useFadeIn()
  return<div ref={ref} style={{opacity:vis?1:0,transform:vis?'translateY(0)':'translateY(32px)',transition:`opacity 0.85s ease ${delay}s, transform 0.85s ease ${delay}s`,...style}}>{children}</div>
}
function ProgressBar(){
  const[p,setP]=useState(0)
  useEffect(()=>{const fn=()=>{const d=document.documentElement;setP((d.scrollTop/(d.scrollHeight-d.clientHeight))*100)};window.addEventListener('scroll',fn,{passive:true});return()=>window.removeEventListener('scroll',fn)},[])
  return<div style={{position:'fixed',top:0,left:0,right:0,height:2,zIndex:100,background:C.border}}><div style={{height:'100%',width:`${p}%`,background:`linear-gradient(90deg,${C.gold},#e8c060)`,transition:'width 0.1s'}}/></div>
}
function Corners({color=C.border}){
  const s={position:'absolute',width:10,height:10,borderColor:color,borderStyle:'solid'}
  return<><div style={{...s,top:0,left:0,borderWidth:'1px 0 0 1px'}}/><div style={{...s,top:0,right:0,borderWidth:'1px 1px 0 0'}}/><div style={{...s,bottom:0,left:0,borderWidth:'0 0 1px 1px'}}/><div style={{...s,bottom:0,right:0,borderWidth:'0 1px 1px 0'}}/></>
}
function SectionLabel({n,text}){
  return<FI><div style={{display:'flex',alignItems:'center',gap:14,marginBottom:32}}><span style={{fontFamily:FM,fontSize:10,color:C.goldDim,letterSpacing:'0.2em'}}>{String(n).padStart(2,'0')}</span><div style={{flex:1,height:1,background:C.border}}/><span style={{fontFamily:FM,fontSize:10,color:C.textDim,letterSpacing:'0.22em'}}>{text}</span></div></FI>
}
const secPad={padding:'clamp(80px,10vw,140px) clamp(20px,6vw,100px)'}
const wrap={maxWidth:900,margin:'0 auto'}
const h2={fontFamily:FG,fontSize:'clamp(30px,4.5vw,58px)',fontWeight:300,color:C.text,lineHeight:1.25,margin:'0 0 20px',letterSpacing:'0.03em'}

function Hero({sRef}){
  return<section ref={sRef} style={{minHeight:'100svh',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',textAlign:'center',padding:'clamp(60px,8vw,100px) clamp(20px,6vw,80px)',background:C.bg,position:'relative',overflow:'hidden'}}>
    <div style={{position:'absolute',inset:0,opacity:0.04,backgroundImage:`linear-gradient(${C.gold} 1px,transparent 1px),linear-gradient(90deg,${C.gold} 1px,transparent 1px)`,backgroundSize:'60px 60px'}}/>
    <FI style={{width:'100%',maxWidth:780,position:'relative'}}>
      <div style={{fontFamily:FM,fontSize:10,color:C.goldDim,letterSpacing:'0.3em',marginBottom:40}}>STYLE ICON — BRAND EXPERIENCE DESIGN</div>
      <h1 style={{fontFamily:FG,fontSize:'clamp(32px,6vw,78px)',fontWeight:300,color:C.text,lineHeight:1.2,margin:'0 0 32px',letterSpacing:'0.02em'}}>リアルとデジタル、<br/><em style={{fontStyle:'italic',color:C.gold}}>ブランドは一致していますか？</em></h1>
      <div style={{width:48,height:1,background:C.gold,margin:'0 auto 32px'}}/>
      <p style={{fontFamily:FB,fontSize:'clamp(14px,1.6vw,17px)',color:C.textMid,lineHeight:1.9,maxWidth:520,margin:'0 auto 56px'}}>イベントの現場で伝わる印象と、<br/>SNSや映像で届くブランドの姿は、一致していますか。</p>
      <div style={{fontFamily:FM,fontSize:10,color:C.textDim,letterSpacing:'0.2em',animation:'float 2.2s ease-in-out infinite'}}>SCROLL ↓</div>
    </FI>
    <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}`}</style>
  </section>
}

const CHECKS=['イベントとSNSのトーンが揃わないと感じたことがある','映像や写真が、ブランドの印象と微妙にズレていると感じた','ブランドガイドラインを現場に落とし込む際、調整に時間がかかった']
function SelfCheck({sRef}){
  const[answers,setAnswers]=useState({})
  const hasYes=Object.values(answers).some(v=>v===true)
  const allAnswered=Object.keys(answers).length===CHECKS.length
  const yesCount=Object.values(answers).filter(v=>v===true).length
  // ①: window保持 ④: ログ
  useEffect(()=>{
    if(!allAnswered)return
    if(typeof window!=='undefined'){window.__diagnosis={yesCount}}
    console.log('diagnosis:',yesCount)
  },[allAnswered,yesCount])
  return<section ref={sRef} style={{...secPad,background:C.surface}}>
    <div style={wrap}>
      <SectionLabel n={2} text="SELF CHECK"/>
      <FI><h2 style={h2}>3つ確認してください。</h2><p style={{fontFamily:FB,fontSize:14,color:C.textMid,marginBottom:48,lineHeight:1.8}}>あてはまるものに答えてください。</p></FI>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        {CHECKS.map((text,i)=>(
          <FI key={i} delay={i*0.12}>
            <div style={{position:'relative',background:C.card,border:`1px solid ${answers[i]===true?C.gold:C.border}`,borderRadius:4,padding:'clamp(18px,3vw,24px) clamp(18px,3vw,28px)',transition:'border-color 0.3s'}}>
              <Corners color={answers[i]===true?C.goldDim:C.border}/>
              <p style={{fontFamily:FB,fontSize:'clamp(13px,1.5vw,16px)',color:answers[i]===true?C.text:C.textMid,lineHeight:1.7,marginBottom:18,transition:'color 0.3s'}}>{text}</p>
              <div style={{display:'flex',gap:10}}>
                {[true,false].map(val=>(
                  <button key={String(val)} onClick={()=>setAnswers(prev=>({...prev,[i]:val}))} style={{fontFamily:FM,fontSize:11,letterSpacing:'0.15em',padding:`8px clamp(16px,3vw,24px)`,background:answers[i]===val?(val?C.gold:C.textDim):'transparent',color:answers[i]===val?C.bg:C.textDim,border:`1px solid ${answers[i]===val?(val?C.gold:C.textDim):C.border}`,borderRadius:2,cursor:'pointer',transition:'all 0.25s'}}>{val?'YES':'NO'}</button>
                ))}
              </div>
            </div>
          </FI>
        ))}
      </div>
      {allAnswered&&<FI delay={0.1}><div style={{marginTop:40,padding:'clamp(24px,3vw,32px) clamp(20px,3vw,36px)',background:hasYes?'rgba(196,151,62,0.08)':'rgba(42,122,74,0.08)',border:`1px solid ${hasYes?C.gold:'#2a7a4a'}`,borderRadius:4,textAlign:'center'}}>
        {hasYes?<><div style={{fontFamily:FM,fontSize:10,color:C.gold,letterSpacing:'0.25em',marginBottom:12}}>DIAGNOSIS</div><div style={{fontFamily:FG,fontSize:'clamp(20px,3vw,34px)',fontWeight:300,color:C.text,marginBottom:14}}>ブランドの<em style={{fontStyle:'italic',color:C.gold}}>分断</em>が起きています。</div><p style={{fontFamily:FB,fontSize:13,color:C.textMid,lineHeight:1.8,maxWidth:480,margin:'0 auto'}}>色味、構図、演出のトーン。<br/>わずかな違いでも、ブランドの印象は大きく変わり得ます。</p></>
        :<><div style={{fontFamily:FG,fontSize:24,fontWeight:300,color:'#2a7a4a',marginBottom:10}}>ブランドの一致が保たれています。</div><p style={{fontFamily:FB,fontSize:13,color:C.textMid,lineHeight:1.8}}>さらなるブランド価値向上に向けて、弊社がお役に立てます。</p></>}
      </div></FI>}
    </div>
  </section>
}

function Fracture({sRef}){
  const nodes=[{label:'企画会社',sub:'コンセプト設計'},{label:'運営会社',sub:'現場・演出'},{label:'SNS会社',sub:'デジタル発信'},{label:'映像会社',sub:'コンテンツ制作'}]
  return<section ref={sRef} style={{...secPad,background:C.bg}}>
    <div style={wrap}>
      <SectionLabel n={3} text="THE FRACTURE"/>
      <FI><h2 style={h2}>それぞれの会社が、<br/><em style={{fontStyle:'italic',color:C.gold}}>それぞれの解釈</em>で動いている。</h2></FI>
      <FI delay={0.1}><div style={{marginTop:48,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:3}}>
        {nodes.map((n,i)=><div key={i} style={{position:'relative',background:C.card,border:`1px solid ${C.border}`,padding:'clamp(20px,2.5vw,28px) clamp(16px,2vw,20px)',textAlign:'center'}}>
          <div style={{fontFamily:FM,fontSize:9,color:C.textDim,letterSpacing:'0.2em',marginBottom:12}}>0{i+1}</div>
          <div style={{fontFamily:FB,fontSize:'clamp(13px,1.4vw,15px)',color:C.textMid,marginBottom:6}}>{n.label}</div>
          <div style={{fontFamily:FM,fontSize:10,color:C.textDim,marginBottom:14}}>{n.sub}</div>
          <div style={{padding:'6px 0',borderTop:`1px solid ${C.border}`,fontFamily:FM,fontSize:9,color:'#8a2010',letterSpacing:'0.1em'}}>独自基準で制作</div>
        </div>)}
      </div></FI>
      <FI delay={0.25}><div style={{marginTop:28,padding:'clamp(22px,3vw,28px) clamp(20px,3vw,32px)',background:'rgba(192,57,43,0.06)',border:'1px solid rgba(192,57,43,0.25)',textAlign:'center'}}>
        <div style={{fontFamily:FM,fontSize:10,color:'#c0392b',letterSpacing:'0.22em',marginBottom:10}}>THE RESULT</div>
        <div style={{fontFamily:FG,fontSize:'clamp(16px,2.5vw,26px)',fontWeight:300,color:C.text,lineHeight:1.5}}>世界観のズレ。調整コストの増大。<br/>イベント後の発信が「後回し」になる。</div>
      </div></FI>
    </div>
  </section>
}

function Comparison({sRef}){
  const left=['業者ごとに異なる色調・トーン','イベント後に映像方針を決める','「なんか違う」で修正が発生','ブランド担当者の工数が増える']
  const right=['企画段階からトーンを統一設計','映像・SNSの見せ方を最初に定義','現場と発信が同じ基準で動く','一社に任せる、それだけ']
  return<section ref={sRef} style={{...secPad,background:C.surface}}>
    <div style={wrap}>
      <SectionLabel n={4} text="BEFORE / AFTER"/>
      <FI><h2 style={h2}>「統一したい」ではなく、<br/><em style={{fontStyle:'italic',color:C.gold}}>統一できる構造か。</em></h2><p style={{fontFamily:FB,fontSize:14,color:C.textMid,lineHeight:1.8,marginBottom:40}}>意志の問題ではなく、体制の問題です。</p></FI>
      <FI delay={0.1}><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:3}}>
        <div style={{position:'relative',background:C.card,border:`1px solid ${C.border}`,padding:'clamp(22px,3vw,36px)'}}>
          <Corners/>
          <div style={{fontFamily:FM,fontSize:9,letterSpacing:'0.22em',color:C.textDim,marginBottom:20}}>分離発注</div>
          {left.map((t,i)=><div key={i} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'11px 0',borderBottom:i<left.length-1?`1px solid ${C.border}`:'none'}}><span style={{fontFamily:FM,fontSize:12,color:'#8a2010',flexShrink:0}}>✕</span><span style={{fontFamily:FB,fontSize:'clamp(12px,1.4vw,14px)',color:C.textDim,lineHeight:1.6}}>{t}</span></div>)}
        </div>
        <div style={{position:'relative',background:`linear-gradient(145deg,${C.card},rgba(196,151,62,0.04))`,border:`1px solid ${C.goldDim}`,padding:'clamp(22px,3vw,36px)'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${C.gold},transparent)`}}/>
          <div style={{fontFamily:FM,fontSize:9,letterSpacing:'0.22em',color:C.gold,marginBottom:20}}>STYLE ICON</div>
          {right.map((t,i)=><div key={i} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'11px 0',borderBottom:i<right.length-1?`1px solid ${C.border}`:'none'}}><span style={{fontFamily:FM,fontSize:12,color:C.gold,flexShrink:0}}>✓</span><span style={{fontFamily:FB,fontSize:'clamp(12px,1.4vw,14px)',color:C.text,lineHeight:1.6}}>{t}</span></div>)}
        </div>
      </div></FI>
    </div>
  </section>
}

function Service({sRef}){
  const items=[{en:'BRAND DESIGN',ja:'ブランド設計',body:'世界観・色調・メッセージ軸を企画段階で定義。全施策の起点を作ります。',num:'01'},{en:'EVENT & PRODUCTION',ja:'イベント制作',body:'花火・ドローン・演出・運営・警備まで。ブランド基準で現場を設計します。',num:'02'},{en:'DIGITAL EXPANSION',ja:'デジタル展開',body:'SNS・映像・LP・KV。現場の熱量をそのままデジタルへ展開します。',num:'03'}]
  return<section ref={sRef} style={{...secPad,background:C.bg}}>
    <div style={wrap}>
      <SectionLabel n={5} text="OUR SERVICE"/>
      <FI><h2 style={h2}>一つのチームで、<br/><em style={{fontStyle:'italic',color:C.gold}}>すべてをまとめる。</em></h2></FI>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:20,marginTop:48}}>
        {items.map((s,i)=><FI key={i} delay={i*0.14}><div style={{position:'relative',background:C.card,border:`1px solid ${C.border}`,padding:'clamp(28px,3vw,36px) clamp(22px,2.5vw,28px)'}}><Corners/><div style={{fontFamily:FG,fontSize:48,fontWeight:300,color:C.gold,opacity:0.18,lineHeight:1,marginBottom:4}}>{s.num}</div><div style={{fontFamily:FM,fontSize:9,letterSpacing:'0.24em',color:C.gold,marginBottom:12}}>{s.en}</div><h3 style={{fontFamily:'Noto Serif JP,serif',fontSize:18,fontWeight:400,color:C.text,margin:'0 0 14px'}}>{s.ja}</h3><p style={{fontFamily:FB,fontSize:13,color:C.textMid,lineHeight:1.85}}>{s.body}</p></div></FI>)}
      </div>
    </div>
  </section>
}

function USP({sRef}){
  const cards=[{tag:'INTEGRATED DESIGN',title:'統一世界観設計',body:'企画段階でブランドトーンを定義し、イベントとSNSの見せ方を同じ軸で設計。世界観のズレを構造的になくします。'},{tag:'SAME TEAM',title:'同一チーム制作',body:'現場の演出設計と、SNS映えする撮影ポイントを同じクリエイターが担当。リアルとデジタルのトーンが自然と揃います。'},{tag:'BRAND STANDARD',title:'品質基準の統一',body:'色調・構図・演出・編集トーンをBtoCブランド基準で管理。「ブランドらしさ」を崩さない制作体制を整えています。'}]
  return<section ref={sRef} style={{...secPad,background:C.surface}}>
    <div style={wrap}>
      <SectionLabel n={6} text="WHY STYLE ICON"/>
      <FI><h2 style={h2}>弊社を選ぶ、<br/><em style={{fontStyle:'italic',color:C.gold}}>3つの理由。</em></h2></FI>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:20,marginTop:48}}>
        {cards.map((c,i)=><FI key={i} delay={i*0.14}><div style={{position:'relative',background:`linear-gradient(160deg,${C.card},rgba(196,151,62,0.03))`,border:`1px solid ${C.border}`,borderTop:`2px solid ${C.gold}`,padding:'clamp(28px,3vw,32px) clamp(22px,2.5vw,28px)'}}><div style={{fontFamily:FM,fontSize:9,letterSpacing:'0.25em',color:C.goldDim,marginBottom:14}}>{c.tag}</div><h3 style={{fontFamily:'Noto Serif JP,serif',fontSize:18,fontWeight:400,color:C.text,margin:'0 0 14px'}}>{c.title}</h3><p style={{fontFamily:FB,fontSize:13,color:C.textMid,lineHeight:1.85}}>{c.body}</p></div></FI>)}
      </div>
    </div>
  </section>
}

function Process({sRef}){
  const steps=[{phase:'DESIGN',ja:'設計',desc:'ブランドの色調・トーン・メッセージ軸を整理。イベント後のSNS展開・映像の残し方まで、最初から一本のラインで設計します。',key:'企画段階から「発信後」を見ている'},{phase:'EXECUTE',ja:'実行',desc:'音楽花火、ドローンショー、装飾・導線・照明・音響まで。ブランドガイドラインを現場に落とし込み、世界観を守りながら運営します。',key:'現場とブランドが同じ基準で動く'},{phase:'EXPAND',ja:'拡散',desc:'ハイライト映像・SNS投稿・LP・KV。現場の熱量をそのままデジタルへ。同じチームが制作するため、世界観が自然と揃います。',key:'リアルの熱量がデジタルに乗る'}]
  return<section ref={sRef} style={{...secPad,background:C.bg}}>
    <div style={wrap}>
      <SectionLabel n={7} text="WORKFLOW"/>
      <FI><h2 style={h2}>企画から発信まで、<br/><em style={{fontStyle:'italic',color:C.gold}}>一本の流れで動く。</em></h2></FI>
      <div style={{marginTop:48}}>
        {steps.map((s,i)=><FI key={i} delay={i*0.16}><div style={{display:'grid',gridTemplateColumns:'clamp(80px,15vw,160px) 1fr',gap:`0 clamp(20px,3vw,40px)`,borderTop:`1px solid ${C.border}`,padding:'clamp(28px,4vw,40px) 0'}}>
          <div><div style={{fontFamily:FG,fontSize:36,fontWeight:300,color:C.gold,opacity:0.3,lineHeight:1}}>{String(i+1).padStart(2,'0')}</div><div style={{fontFamily:FM,fontSize:9,letterSpacing:'0.22em',color:C.gold,margin:'8px 0 4px'}}>{s.phase}</div><div style={{fontFamily:'Noto Serif JP,serif',fontSize:14,color:C.text}}>{s.ja}</div></div>
          <div><p style={{fontFamily:FB,fontSize:'clamp(13px,1.4vw,15px)',color:C.textMid,lineHeight:1.85,margin:'0 0 14px'}}>{s.desc}</p><div style={{fontFamily:FM,fontSize:10,color:C.gold,letterSpacing:'0.1em',borderBottom:`1px solid ${C.goldDim}`,paddingBottom:2,display:'inline-block'}}>✦ {s.key}</div></div>
        </div></FI>)}
        <div style={{borderTop:`1px solid ${C.border}`}}/>
      </div>
    </div>
  </section>
}

function Track({sRef}){
  const highlights=['EXPO2025 シンガポール・オマーン各パビリオン','江崎グリコ様（ポッキー）プロモーション','みなとHANABI 2025 — WEB・広報・制作・運営','万博花火 2025 — 広報・制作・運営・警備','AnimeJapan 2025 / a-nation 2025','飲料・アパレル・化粧品ブランドの世界観統一型施策']
  return<section ref={sRef} style={{...secPad,background:C.surface}}>
    <div style={wrap}>
      <SectionLabel n={8} text="TRACK RECORD"/>
      <FI><h2 style={h2}>実績が語る、<br/><em style={{fontStyle:'italic',color:C.gold}}>信頼の証。</em></h2></FI>
      <FI delay={0.1}><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:3,marginTop:48}}>
        {[{num:'¥7億+',label:'単一PJ最大規模',note:'自治体主催イベント'},{num:'30+',label:'年間運営イベント数',note:'2025年実績'},{num:'BtoC',label:'ブランド案件多数',note:'食品・飲料・化粧品・アパレル'}].map((item,i)=><div key={i} style={{position:'relative',background:C.card,border:`1px solid ${C.border}`,padding:'clamp(22px,3vw,28px) clamp(18px,2.5vw,24px)',textAlign:'center'}}><Corners/><div style={{fontFamily:FG,fontSize:'clamp(26px,3.5vw,40px)',fontWeight:300,color:C.gold,lineHeight:1,marginBottom:8}}>{item.num}</div><div style={{fontFamily:FB,fontSize:13,color:C.text,marginBottom:4}}>{item.label}</div><div style={{fontFamily:FM,fontSize:10,color:C.textDim}}>{item.note}</div></div>)}
      </div></FI>
      <FI delay={0.2}><div style={{marginTop:20,background:C.card,border:`1px solid ${C.border}`,padding:'clamp(22px,3vw,28px) clamp(20px,3vw,32px)'}}>
        <div style={{fontFamily:FM,fontSize:9,color:C.goldDim,letterSpacing:'0.22em',marginBottom:18}}>2025 HIGHLIGHTS</div>
        {highlights.map((h,i)=><div key={i} style={{display:'flex',alignItems:'flex-start',gap:12,padding:'10px 0',borderBottom:i<highlights.length-1?`1px solid ${C.border}`:'none'}}><span style={{fontFamily:FM,fontSize:9,color:C.goldDim,flexShrink:0,marginTop:3}}>✦</span><span style={{fontFamily:FB,fontSize:'clamp(12px,1.3vw,14px)',color:C.textMid,lineHeight:1.6}}>{h}</span></div>)}
      </div></FI>
    </div>
  </section>
}

function Benefit({sRef}){
  const items=[{label:'ブランド価値向上',points:['リアルとデジタルの世界観が揃う','一貫したブランド体験を提供できる','自然なSNS拡散が生まれやすい']},{label:'管理工数の削減',points:['複数業者への調整が不要になる','窓口一本化で進捗管理が楽になる','修正・確認の往復が減る']},{label:'コスト効率の改善',points:['分離発注による調整コストが消える','限られた予算で最大のブランド効果','継続展開でコストパフォーマンスが上がる']}]
  return<section ref={sRef} style={{...secPad,background:C.bg}}>
    <div style={wrap}>
      <SectionLabel n={9} text="YOUR BENEFIT"/>
      <FI><h2 style={h2}>一本化すると、<br/><em style={{fontStyle:'italic',color:C.gold}}>何が変わるか。</em></h2></FI>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:20,marginTop:48}}>
        {items.map((item,i)=><FI key={i} delay={i*0.14}><div style={{background:C.card,border:`1px solid ${C.border}`,padding:'clamp(26px,3vw,32px) clamp(22px,2.5vw,28px)'}}><div style={{fontFamily:FM,fontSize:9,letterSpacing:'0.22em',color:C.gold,marginBottom:14}}>0{i+1}</div><div style={{fontFamily:'Noto Serif JP,serif',fontSize:17,color:C.text,marginBottom:18}}>{item.label}</div>{item.points.map((p,j)=><div key={j} style={{display:'flex',gap:10,alignItems:'flex-start',padding:'9px 0',borderTop:`1px solid ${C.border}`}}><span style={{fontFamily:FM,fontSize:10,color:C.gold,flexShrink:0,marginTop:2}}>✓</span><span style={{fontFamily:FB,fontSize:13,color:C.textMid,lineHeight:1.65}}>{p}</span></div>)}</div></FI>)}
      </div>
      <FI delay={0.3}><div style={{marginTop:28,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:14}}>
        {['「現場からデジタルまで理解している」','「ブランドを崩さず任せられる」','「一つのチームだとここまで統一感が出るのですね」'].map((q,i)=><div key={i} style={{padding:'clamp(16px,2vw,20px) clamp(18px,2.5vw,24px)',borderLeft:`2px solid ${C.goldDim}`,background:'rgba(196,151,62,0.04)'}}><p style={{fontFamily:'Noto Serif JP,serif',fontSize:14,color:C.textMid,lineHeight:1.7,margin:0,fontStyle:'italic'}}>{q}</p></div>)}
      </div></FI>
    </div>
  </section>
}

function Closing({sRef}){
  return<section ref={sRef} style={{minHeight:'70svh',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',textAlign:'center',padding:'clamp(80px,10vw,140px) clamp(20px,6vw,80px)',background:C.surface,position:'relative',overflow:'hidden'}}>
    <div style={{position:'absolute',inset:0,opacity:0.03,backgroundImage:`radial-gradient(${C.gold} 1px,transparent 1px)`,backgroundSize:'32px 32px'}}/>
    <div style={{position:'relative',maxWidth:640,width:'100%'}}>
      <FI>
        <div style={{fontFamily:FM,fontSize:10,color:C.goldDim,letterSpacing:'0.28em',marginBottom:32}}>10 — NEXT STEP</div>
        <h2 style={{fontFamily:FG,fontSize:'clamp(26px,4vw,54px)',fontWeight:300,color:C.text,lineHeight:1.3,margin:'0 0 24px'}}>貴社専用の設計を、<br/><em style={{fontStyle:'italic',color:C.gold}}>シミュレーションします。</em></h2>
        <div style={{width:40,height:1,background:C.gold,margin:'0 auto 32px'}}/>
        <p style={{fontFamily:FB,fontSize:'clamp(14px,1.6vw,16px)',color:C.textMid,lineHeight:1.9,marginBottom:48}}>貴社のブランドに合わせた具体的なプランと、<br/>類似実績ポートフォリオをご用意します。<br/>次回、30分だけお時間をいただけますか。</p>
      </FI>
      <FI delay={0.15}><div style={{position:'relative',background:C.card,border:`1px solid ${C.border}`,borderTop:`2px solid ${C.gold}`,padding:'clamp(26px,3vw,32px) clamp(24px,3vw,36px)',textAlign:'center'}}>
        <Corners color={C.goldDim}/>
        <div style={{fontFamily:FG,fontSize:22,letterSpacing:'0.1em',color:C.text,marginBottom:4}}>STYLE ICON Co., Ltd.</div>
        <div style={{fontFamily:'Noto Serif JP,serif',fontSize:13,color:C.textMid,marginBottom:22}}>株式会社スタイルアイコン</div>
        <div style={{fontFamily:FB,fontSize:12,color:C.textMid,lineHeight:2.4}}>〒541-0043 大阪市中央区高麗橋2丁目2-7 東栄ビル 3F<br/>TEL: 06-4708-6808<br/><a href="http://styleicon.co.jp" target="_blank" rel="noopener noreferrer" style={{color:C.gold,textDecoration:'none'}}>styleicon.co.jp</a></div>
      </div></FI>
    </div>
  </section>
}

const P_SECTIONS=[
  {id:'intro',label:'イントロ',cs:'hero',min:2,
   preview:{label:'01 — OPENING',headline:'リアルとデジタル、ブランドは一致していますか？',sub:'ファーストビュー。問いを投げて場を作る。',accent:'#c4973e'},
   goal:'相手に「聞いてみよう」と思わせる。場を温め、今日の目的を一言で伝える。',
   script:`株式会社スタイルアイコンの〇〇です。\n本日はお時間を頂戴し、誠にありがとうございます。\n\n先日はお電話にて少しお話しさせていただきましたが、貴社のようにブランドを大切にされている企業様にとって、リアルとデジタルの印象が揃っているかどうかは、今後さらに重要なテーマになると感じております。\n\nイベントの現場で体験される印象と、SNSや映像で伝わるブランドの姿が一致しているか。この一点が整うだけでも、ブランド価値は大きく変化いたします。\n\n本日は、弊社がご提供できる内容の中で、「ブランド価値がどのように高まり得るのか」「貴社の調整工数をどの程度削減できるのか」といった点を、貴社の状況も伺いながら具体的にお話しできればと存じます。\n\n何卒よろしくお願いいたします。`,
   points:['「〇〇」に自分の名前を入れる','「リアルとデジタルの印象が揃っているかどうか」をゆっくり発音','最後の礼で一呼吸おき、相手の反応を見る'],
   watch:'挨拶が長くなりがち。2分以内に収め、すぐアイスブレイクに移る。'},
  {id:'icebreak',label:'ヒアリング①',cs:'check',min:5,
   preview:{label:'02 — SELF CHECK',headline:'3つ確認してください。',sub:'相手が自分の課題に気づくYes/No診断。',accent:'#c4973e'},
   goal:'相手の興味の理由と現状体制を把握する。課題感に共感し「お役に立てそう」で締める。',
   script:`●●様、最初に1点お伺いしてもよろしいでしょうか？\n\n先日は突然のお電話にも関わらず、ご興味を持っていただけた理由を始めにお伺いしてもよろしいでしょうか？\n\n（相手の回答を受ける）\n\nありがとうございます。そういった背景からご関心をお持ちいただいたのですね。\n\n差し支えなければ、現在のブランドコミュニケーションやイベント運営について、いくつかお伺いさせてください。\n\n・イベントとSNSのトーンが揃いにくいと感じられることはございますか。\n・イベントの写真や映像が、ブランドの印象とやや異なると感じられたご経験はございますか。\n・ブランドガイドラインを現場演出に落とし込む際、調整にお時間を要する場面はございますか。\n\nありがとうございます。状況を理解いたしました。\nお話を伺う中で、貴社の今後の施策においてもお役立てできる部分があるのではないかと感じております。`,
   points:['「（相手の回答を受ける）」では必ず5秒以上待つ','3問すべて聞かなくてOK。深掘り優先','「〜ご経験はございますか」の表現で柔らかく'],
   watch:'質問を畳み掛けすぎない。1問答えてもらったら必ず共感を挟む。'},
  {id:'fracture',label:'分断構造',cs:'fracture',min:3,
   preview:{label:'03 — THE FRACTURE',headline:'それぞれの会社が、それぞれの解釈で動いている。',sub:'4社バラバラ構造の図解。課題を視覚化する。',accent:'#c0392b'},
   goal:'「分断されている現状」に共感を呼び起こし、弊社の解決策を印象づける。',
   script:`弊社は、ブランド設計を起点に、企画／現場演出・運営／WEB施策までを、一つのチームで一貫して設計・制作しております。\n\n近年は、イベント単体の成功だけでなく、次の施策へどのようにつなげられるか、またブランドとしてどのように認知されるかが、より重要になってきております。\n\n一方で、企画会社・運営会社・SNS会社・映像会社など、関係各社が分かれて進行することで、世界観のズレや調整コストの増加に課題を感じていらっしゃる企業様も多くいらっしゃいます。\n\n色味、構図、演出のトーン。\nわずかな違いでも、ブランドの印象は大きく変わり得ます。\n\n弊社では、こうした分断を避けるために、企画・運営からWEB・SNS運用までを一体で設計できる体制を整えております。`,
   points:['「分かれて進行することで」を言うとき指を折って列挙するジェスチャーが有効','「色味、構図、演出のトーン」はゆっくり一つずつ発音する','最後の「一体で設計」でソリューションを提示'],
   watch:'競合他社を名指しで批判しない。「多い」という表現で一般論に留める。'},
  {id:'comparison',label:'ポジショニング',cs:'comparison',min:3,
   preview:{label:'04 — BEFORE / AFTER',headline:'「統一したい」ではなく、統一できる構造か。',sub:'分離発注 vs STYLE ICONの比較表。',accent:'#c4973e'},
   goal:'「意志の問題」ではなく「体制の問題」にフレームを転換する。',
   script:`「統一したい」というお気持ちは多くの企業様がお持ちです。\n\nただ、それが実現しない理由は、意志の問題ではなく、体制の問題です。\n\n企画・運営・SNS・映像がそれぞれ別の会社で動いていれば、どれだけ意識を合わせても、細かなズレは必ず生まれます。\n\n弊社が提供しているのは、「統一しやすい体制」そのものです。\n\n同じチームが、企画段階からデジタル展開まで一貫して関わるため、世界観のズレが構造的に起きにくい。\n\n（相手の反応を受ける）`,
   points:['「意志の問題ではなく、体制の問題」は断言。自信を持って言い切る','左右の比較を指差しながら説明すると視覚的に整理される','相手がうなずいたら次に進む'],
   watch:'ここで長くなりすぎない。比較図は見てもらうだけで十分。'},
  {id:'service',label:'サービス概要',cs:'service',min:2,
   preview:{label:'05 — OUR SERVICE',headline:'一つのチームで、すべてをまとめる。',sub:'ブランド設計・イベント制作・デジタル展開の3領域。',accent:'#c4973e'},
   goal:'ワンストップで対応できる会社であることを一言で印象づける。',
   script:`弊社は、イベントの企画から当日の運営、そしてSNSや映像などの発信まで、一つのチームでまとめてお手伝いしている会社です。\n\n大きく3つの領域をカバーしています。\n\n一つ目は、ブランド設計。世界観・色調・メッセージ軸を企画段階で定義します。\n\n二つ目は、イベント制作。花火・ドローン・演出・運営・警備まで、現場全体を担当します。\n\n三つ目は、デジタル展開。SNS・映像・LP・KVを、現場と同じチームが制作します。\n\nこの三つが一体であることが、弊社の最大の特徴です。`,
   points:['「一つのチームで」を強調。競合との最大の差別化ポイント','3つを指で数えながら話す','「この三つが一体」で締める'],
   watch:'詳細に入りすぎない。概要は1分で済ませ、次のUSPで深掘りする。'},
  {id:'usp',label:'USP 3点',cs:'usp',min:3,
   preview:{label:'06 — WHY STYLE ICON',headline:'弊社を選ぶ、3つの理由。',sub:'統一世界観設計・同一チーム制作・品質基準統一。',accent:'#c4973e'},
   goal:'「この会社は違う」と思わせる3つの強みを記憶に残す。',
   script:`これまでの実績に基づいて、貴社にメリットと感じていただけるポイントを3点お話しさせていただきます。\n\n一つ目は、ブランド世界観の統一設計です。\n企画段階からブランドのトーンを定義し、イベントとSNSの見せ方を同じ軸で設計することで、世界観のズレを最小限に抑えることができます。\n\n二つ目は、リアルとデジタルを同じチームで制作する点です。\n現場の演出や装飾、導線の設計と、SNS映えする素材の撮影ポイントまで一貫して設計できるため、リアルとデジタルのトーンが自然と揃います。\n\n最後に、ブランド価値を損なわないクリエイティブ基準です。\n色味や構図、演出、編集のトーンを統一し、ブランドらしさを崩さない制作体制を整えています。`,
   points:['「一つ目」「二つ目」「最後に」と指を立てながら話す','「世界観のズレを最小限に」は断言。自信を持って言い切る','「ブランドらしさを崩さない」は最後に使う効果がある'],
   watch:'3点を同じテンポで話さない。最後の「クリエイティブ基準」が一番刺さりやすい。'},
  {id:'basic',label:'サービス詳細',cs:'process',min:4,
   preview:{label:'07 — WORKFLOW',headline:'企画から発信まで、一本の流れで動く。',sub:'設計→実行→拡散の3ステップ詳細。',accent:'#c4973e'},
   goal:'「企画→デジタル」の一体設計を具体的なイメージで伝える。',
   script:`弊社がどのようにブランドの世界観を統一しながら、イベントとデジタル施策をご提案しているのか、流れに沿って簡単にご説明いたします。\n\nまず設計段階では、ブランドの世界観・色味・トーン・価値観を整理し、イベント当日の体験設計と同時に、SNSでどのように広がる設計にするか、どのような映像が残るとブランド価値が高まるか、どの瞬間を「ブランドらしい絵」として切り取るかといった点を、最初から同じライン上で設計いたします。\n\n実行フェーズでは、音楽花火やドローンショーのような大規模演出をはじめ、装飾・導線・照明・音響のトーン設計、安全管理マニュアルやスタッフ配置など、現場を成立させるための実務まで一括で対応いたします。\n\nイベント後は、当日の熱量をそのままデジタルへ展開できるよう、ハイライト映像、SNS投稿設計、LP制作、キービジュアル開発など、オンライン側のクリエイティブも同じチームで担当いたします。`,
   points:['「音楽花火やドローンショー」はっきり発音','「最初から同じライン上で」は差別化の核心。ゆっくり言う','最後は相手の顔を見ながら'],
   watch:'全部を説明しようとしない。相手が興味を示した部分を深掘りする姿勢で。'},
  {id:'track',label:'実績紹介',cs:'track',min:2,
   preview:{label:'08 — TRACK RECORD',headline:'実績が語る、信頼の証。',sub:'¥7億+・30+件・グリコ・EXPO2025。',accent:'#8a6828'},
   goal:'固有名詞と規模感で「この会社は本物だ」という信頼感を与える。',
   script:`弊社では、大手代理店様や大手旅行会社様経由のイベント案件を多数担当しており、とりわけブランドイメージが重要となるBtoC企業様の案件を多く手掛けてまいりました。\n\n江崎グリコ様（ポッキー）のプロモーションでは、ブランドの世界観を踏まえたイベント演出とデジタル施策を一体で制作しております。\n\nまた、飲料メーカー様・アパレル・化粧品ブランドの世界観統一型イベントのほか、大阪で実施している音楽花火、万博関連のイベントなど、幅広いプロジェクトを担当しております。\n\nこうした実績をもとに、貴社のブランドに合わせた「世界観統一型イベント」の設計が可能でございます。`,
   points:['「江崎グリコ様（ポッキー）」は誰もが知るブランド名。効果が高い','「¥7億+」は数字として印象に残る。はっきり言い切る','最後の「貴社のブランドに合わせた」で相手ごとの話に戻す'],
   watch:'実績の羅列にならないように。「どんなブランドのために何をしたか」の文脈で話す。'},
  {id:'hearing',label:'ヒアリング②',cs:'benefit',min:5,
   preview:{label:'09 — YOUR BENEFIT',headline:'一本化すると、何が変わるか。',sub:'ヒアリングしながら、ベネフィットを提示。',accent:'#c4973e'},
   goal:'相手の現状・ニーズ・決裁構造・タイミングを把握し、BANT情報を揃える。',
   script:`ここまで一方的にお話いたしまして、お聞きいただきありがとうございます。\nここからは貴社の現状や、今日お聞きいただいた内容の中で「ここが気になる」「少し深掘りしたい」と感じられた部分を伺えればと思っています。\n\n（相手の反応を受ける）\n\n実現可能な進め方を設計するため、差し支えない範囲で確認させてください。\n\n・もしイベント含むプロモーションを実施されるとしたら、どれくらいの規模感をイメージされていますか。\n・こういった取り組みは、貴社内ではどなたと一緒に検討されることが多いでしょうか。\n・ブランドとして、どんな見せ方や状態が実現すると理想だと感じていらっしゃいますか。\n・時期については、まだ未定でも構いませんので、ざっくりとしたイメージはありますか。`,
   points:['「一方的にお話いたしまして」で謙虚さを示してから質問に入る','4問の順番は厳守しない。相手が話してくれたことを優先的に深掘りする','「まだ未定でも構いません」でタイミング質問へのハードルを下げる'],
   watch:'相手が話し始めたら絶対に遮らない。沈黙が5秒続いても待つ。',
   bant:true},
  {id:'qa',label:'Q&A',cs:null,min:3,
   preview:null,
   goal:'想定質問に自信を持って答え、「次回でより詳しく」へトスアップする。',
   script:`（ここからは相手の質問に応じて答えます。）\n\nQ：費用感はどれくらいですか？\n→ ありがとうございます。規模によって大きく変わるため、今日の段階では確定の金額は申し上げにくいのですが、貴社の目的やブランドの方向性を伺えれば、次回具体的なシミュレーションをご提示できます。\n\nQ：イベントだけの依頼も可能ですか？\n→ はい、可能です。イベント単体でも承りますが、ブランドイメージの統一という観点では、SNSや映像と合わせて設計した方が効果が大きくなるため、次回は両方のパターンをご用意いたします。\n\nQ：SNSや映像制作だけお願いすることもできますか？\n→ はい、問題ございません。ブランドの世界観を踏まえたクリエイティブ制作のみのご依頼も承っています。\n\nQ：どの規模まで対応できますか？\n→ 自治体主催の大規模イベントから、数百名規模のブランドイベントまで幅広く対応しています。\n\nQ：遠方の案件も対応できますか？\n→ イベントは関西〜関東・九州が中心ですが、規模によっては全国対応可能です。デジタル施策は全国でご対応させていただきます。`,
   points:['費用の質問には金額を言わない。「次回シミュレーション」で次商談の理由を作る','「両方のパターンを用意」は選択肢を与える表現で承認率が上がる','答えに詰まったら「次回より詳しく」でトスアップ。焦らない'],
   watch:'金額の具体的な数字は言わない。次回商談の価値が下がる。'},
  {id:'closing',label:'クロージング',cs:'contact',min:3,
   preview:{label:'10 — NEXT STEP',headline:'貴社専用の設計をシミュレーションします。',sub:'次回日程を二択で提示。連絡先を確認。',accent:'#c4973e'},
   goal:'次回商談の日程を決める。二択で提示し、返答しやすくする。',
   script:`ありがとうございます。\n\n貴社のブランドでございましたら、イベントや各種プロモーションを、ブランドイメージの一貫性を保ちながら、よりスムーズに進行できるのではないかと考えております。\n\nより具体的なイメージをお持ちいただけるよう、近しいシチュエーションでの実績ポートフォリオをご用意したいと存じます。\n\nつきましては、「〇月〇日（〇曜日）」または「〇月〇日（〇曜日）」のいずれかで、お時間を頂戴することは可能でしょうか。\n\nご都合のよろしい日程をお知らせいただけますと幸いです。\n\n（相手の回答を受ける）\n\nお時間は午前と午後はどちらがご都合よろしいでしょうか？\n\nでは、●月●日の●時でお時間を頂戴できればと思いますので、よろしくお願いいたします。`,
   points:['日程は「〇月〇日か〇月〇日」の二択で出す。「いつにしましょうか」と聞かない','「午前か午後」→「〇時か〇時」と段階を踏んで絞り込む','決まったら復唱して確定させる'],
   watch:'「また連絡します」で終わらせない。必ず当日中に次のアクションを決める。',
   objections:true},
]

const BANT_ITEMS=[{key:'B',label:'Budget',q:'予算・規模感のイメージ'},{key:'A',label:'Authority',q:'意思決定者・決裁者'},{key:'N',label:'Needs',q:'理想のブランド状態・解決したい課題'},{key:'T',label:'Timing',q:'実施時期のイメージ'}]
const OBJECTIONS=[
  {trigger:'検討したい',response:`ご検討の時間が必要というお気持ち、よく分かります。\n判断材料を揃える意味でも、一度貴社のブランドに合わせた具体的なシミュレーションをご覧いただく方が、検討もしやすくなるかと思います。\n三十分ほどのお時間で構いませんので、次回は貴社の状況に当てはめた案をお持ちしてもよろしいでしょうか。`,tip:'次商談のアジェンダを「ブランド診断シミュレーション」として価値化する'},
  {trigger:'見送りたい',response:`承知いたしました。率直にお話しいただきありがとうございます。\nただ、先ほど伺った課題感を踏まえると、情報整理の場を一度設けていただくことで、今後のブランドコミュニケーションにも役立つ示唆をお渡しできると思っています。\n軽い打ち合わせで構いませんので、次回だけお時間をいただけませんでしょうか。`,tip:'「見送る理由」を一つ引き出す。それが次回商談の起点になる'},
  {trigger:'社内確認が必要',response:`ありがとうございます。社内調整が必要という状況、よく理解いたしました。\n社内で共有いただく際にも、具体的なシミュレーションがあった方が説明しやすいかと思います。\n次回は貴社内でそのまま使える資料をお持ちしますので、三十分ほどお時間をいただければと思います。`,tip:'次商談に「社内共有用の資料」という具体的な約束を作る'},
]

function LivePreview({section}){
  if(!section.cs||!section.preview)return<div style={{background:'#181614',border:'1px solid #2a2520',borderRadius:6,padding:16}}><div style={{fontFamily:FM,fontSize:10,color:'#504838'}}>— このスライドは顧客画面に表示されません</div></div>
  const pr=section.preview
  return<div style={{background:'#181614',border:'1px solid #2a2520',borderRadius:6,overflow:'hidden'}}>
    <div style={{display:'flex',alignItems:'center',gap:8,padding:'6px 12px',background:'#0a1a0a',borderBottom:'1px solid #2a2520'}}><div style={{width:7,height:7,borderRadius:'50%',background:'#22c55e'}}/><span style={{fontFamily:FM,fontSize:9,color:'#22c55e',letterSpacing:'0.1em'}}>LIVE — 顧客画面</span></div>
    <div style={{padding:'14px 16px'}}><div style={{fontFamily:FM,fontSize:9,letterSpacing:'0.2em',color:pr.accent||C.gold,marginBottom:6}}>{pr.label}</div><div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:4}}>{pr.headline}</div><div style={{fontSize:11,color:C.textMid,lineHeight:1.6}}>{pr.sub}</div></div>
  </div>
}

function PresenterView(){
  const[cur,setCur]=useState(0);const[done,setDone]=useState(new Set());const[bantChecked,setBantChecked]=useState({});const[objOpen,setObjOpen]=useState(null)
  const curRef=useRef(0);const timer=useElapsedTimer();const sendSync=useSyncSend()
  const go=(dir)=>{
    const next=Math.max(0,Math.min(P_SECTIONS.length-1,curRef.current+dir))
    if(next===curRef.current)return
    const prev=curRef.current;curRef.current=next;setCur(next)
    setDone(d=>new Set([...d,P_SECTIONS[prev].id]))
    if(P_SECTIONS[next].cs)sendSync(P_SECTIONS[next].cs)
    console.log('section:',P_SECTIONS[next].id)
  }
  const jumpTo=(i)=>{
    if(i===curRef.current)return
    const prev=curRef.current;curRef.current=i;setCur(i)
    setDone(d=>new Set([...d,P_SECTIONS[prev].id]))
    if(P_SECTIONS[i].cs)sendSync(P_SECTIONS[i].cs)
    console.log('section:',P_SECTIONS[i].id)
  }
  useEffect(()=>{const fn=(e)=>{if(e.key==='ArrowRight'||e.key==='ArrowDown')go(1);if(e.key==='ArrowLeft'||e.key==='ArrowUp')go(-1)};window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn)},[])
  const sec=P_SECTIONS[cur];const progress=(cur/(P_SECTIONS.length-1))*100
  return<div style={{background:'#0d0c0a',minHeight:'100svh',fontFamily:FB,color:C.text,userSelect:'none'}}>
    {/* トップバー */}
    <div style={{position:'sticky',top:0,zIndex:50,background:'#181614',borderBottom:'1px solid #2a2520',padding:'10px clamp(12px,3vw,24px)',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
      <div style={{fontFamily:FM,fontSize:10,color:C.gold,letterSpacing:'0.2em'}}>PRESENTER MODE</div>
      <div style={{fontFamily:FM,fontSize:16,color:timer.over?C.pRed:C.gold,transition:'color 0.5s'}}>{timer.str}</div>
      <a href="/" target="_blank" rel="noopener noreferrer" style={{fontFamily:FM,fontSize:9,color:C.textMid,letterSpacing:'0.15em',textDecoration:'none',border:'1px solid #2a2520',padding:'4px 10px',borderRadius:2}}>顧客画面 ↗</a>
    </div>
    {/* プログレス */}
    <div style={{height:2,background:'#2a2520'}}><div style={{height:'100%',width:`${progress}%`,background:`linear-gradient(90deg,${C.gold},#e8c060)`,transition:'width 0.3s'}}/></div>
    {/* タブ（横スクロール） */}
    <div style={{background:'#181614',borderBottom:'1px solid #2a2520',overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
      <div style={{display:'flex',minWidth:'max-content',padding:'0 clamp(8px,2vw,16px)'}}>
        {P_SECTIONS.map((s,i)=><button key={s.id} onClick={()=>jumpTo(i)} style={{fontFamily:FM,fontSize:9,letterSpacing:'0.12em',padding:`12px clamp(10px,1.5vw,16px)`,background:'transparent',color:cur===i?C.gold:done.has(s.id)?'#22c55e':C.textDim,border:'none',borderBottom:cur===i?`2px solid ${C.gold}`:'2px solid transparent',cursor:'pointer',whiteSpace:'nowrap',transition:'color 0.2s'}}>
          {done.has(s.id)&&<span style={{marginRight:4,fontSize:7}}>●</span>}{s.label}
        </button>)}
      </div>
    </div>
    {/* ヘッダー */}
    <div style={{padding:'clamp(10px,2vw,14px) clamp(12px,3vw,24px)',background:'#0d0c0a',borderBottom:'1px solid #2a2520',display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
      <span style={{fontFamily:FM,fontSize:9,color:sec.cs?'#22c55e':C.textDim,letterSpacing:'0.12em'}}>{sec.cs?'● SYNC ON':'○ NO SYNC'}</span>
      <span style={{fontFamily:'Noto Serif JP,serif',fontSize:16,color:C.text,fontWeight:400}}>{sec.label}</span>
      <span style={{marginLeft:'auto',fontFamily:FM,fontSize:10,color:C.textDim}}>{cur+1} / {P_SECTIONS.length}</span>
      <span style={{fontFamily:FM,fontSize:9,color:C.textDim}}>{sec.min}分</span>
    </div>
    {/* メイン */}
    <div style={{padding:'clamp(16px,3vw,24px) clamp(12px,3vw,24px)'}}>
      <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) clamp(200px,28vw,300px)',gap:'clamp(12px,2vw,20px)',alignItems:'start'}}>
        {/* 左：台本 */}
        <div style={{display:'flex',flexDirection:'column',gap:16,minWidth:0}}>
          <div style={{background:'rgba(34,197,94,0.08)',border:'1px solid rgba(34,197,94,0.2)',borderRadius:4,padding:'clamp(12px,2vw,16px) clamp(14px,2vw,20px)'}}>
            <div style={{fontFamily:FM,fontSize:9,color:'#22c55e',letterSpacing:'0.18em',marginBottom:6}}>GOAL</div>
            <div style={{fontSize:13,color:'#86efac',lineHeight:1.7}}>{sec.goal}</div>
          </div>
          <div style={{background:'#181614',border:'1px solid #2a2520',borderRadius:4,padding:'clamp(14px,2.5vw,20px) clamp(14px,2.5vw,24px)'}}>
            <div style={{fontFamily:FM,fontSize:9,color:C.textDim,letterSpacing:'0.18em',marginBottom:12}}>SCRIPT</div>
            <pre style={{fontFamily:FB,fontSize:'clamp(13px,1.3vw,15px)',color:'#d4f0c0',lineHeight:1.9,margin:0,whiteSpace:'pre-wrap',wordBreak:'break-all'}}>{sec.script}</pre>
          </div>
          {sec.bant&&<div style={{background:'#181614',border:'1px solid #2a2520',borderRadius:4,padding:'clamp(14px,2vw,20px)'}}>
            <div style={{fontFamily:FM,fontSize:9,color:C.gold,letterSpacing:'0.18em',marginBottom:14}}>BANT CHECK</div>
            {BANT_ITEMS.map(item=><div key={item.key} onClick={()=>setBantChecked(prev=>({...prev,[item.key]:!prev[item.key]}))} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:'1px solid #2a2520',cursor:'pointer'}}>
              <div style={{width:18,height:18,border:`1px solid ${bantChecked[item.key]?'#22c55e':'#2a2520'}`,borderRadius:2,background:bantChecked[item.key]?'rgba(34,197,94,0.15)':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all 0.2s'}}>{bantChecked[item.key]&&<span style={{fontSize:10,color:'#22c55e'}}>✓</span>}</div>
              <span style={{fontFamily:FM,fontSize:10,color:C.gold,width:20,flexShrink:0}}>{item.key}</span>
              <span style={{fontFamily:FM,fontSize:10,color:C.textMid}}>{item.label}</span>
              <span style={{fontSize:12,color:C.textDim,marginLeft:'auto'}}>{item.q}</span>
            </div>)}
          </div>}
          {sec.objections&&<div style={{background:'#181614',border:'1px solid #2a2520',borderRadius:4,padding:'clamp(14px,2vw,20px)'}}>
            <div style={{fontFamily:FM,fontSize:9,color:C.pRed,letterSpacing:'0.18em',marginBottom:14}}>OBJECTION HANDLING</div>
            {OBJECTIONS.map((obj,i)=><div key={i} style={{marginBottom:10}}>
              <div onClick={()=>setObjOpen(objOpen===i?null:i)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:3,cursor:'pointer'}}>
                <span style={{fontFamily:FM,fontSize:10,color:'#fca5a5'}}>「{obj.trigger}」</span>
                <span style={{fontFamily:FM,fontSize:10,color:C.textDim}}>{objOpen===i?'▲':'▼'}</span>
              </div>
              {objOpen===i&&<div style={{padding:'14px 16px',background:'rgba(239,68,68,0.04)',border:'1px solid rgba(239,68,68,0.15)',borderTop:'none',borderRadius:'0 0 3px 3px'}}>
                <pre style={{fontFamily:FB,fontSize:12,color:C.textMid,lineHeight:1.8,margin:'0 0 10px',whiteSpace:'pre-wrap'}}>{obj.response}</pre>
                <div style={{fontFamily:FM,fontSize:10,color:C.gold,borderTop:'1px solid #2a2520',paddingTop:10}}>▸ TIP: {obj.tip}</div>
              </div>}
            </div>)}
          </div>}
        </div>
        {/* 右サイド */}
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <LivePreview section={sec}/>
          {/* ② 診断結果カード（常時表示） */}
          {(()=>{
            const yc=typeof window!=='undefined'&&window.__diagnosis?window.__diagnosis.yesCount:-1
            if(yc<0)return null
            const cfg=yc>=2
              ?{icon:'⚠',label:'ブランド分断状態（提案強）',bg:'rgba(239,68,68,0.08)',border:'rgba(239,68,68,0.3)',color:'#fca5a5',dot:'#ef4444'}
              :yc===1
              ?{icon:'△',label:'軽度のズレあり',bg:'rgba(234,179,8,0.08)',border:'rgba(234,179,8,0.3)',color:'#fde047',dot:'#eab308'}
              :{icon:'○',label:'現状維持 or 伸びしろ',bg:'rgba(34,197,94,0.08)',border:'rgba(34,197,94,0.25)',color:'#86efac',dot:'#22c55e'}
            return<div style={{background:cfg.bg,border:`1px solid ${cfg.border}`,borderRadius:4,padding:'10px 14px'}}>
              <div style={{fontFamily:FM,fontSize:9,color:cfg.dot,letterSpacing:'0.18em',marginBottom:6}}>DIAGNOSIS</div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:13,color:cfg.color}}>{cfg.icon}</span>
                <span style={{fontFamily:FB,fontSize:12,color:cfg.color,lineHeight:1.5}}>{cfg.label}</span>
              </div>
            </div>
          })()}
          {/* ③ クロージング時のみガイド表示 */}
          {sec.id==='closing'&&(()=>{
            const yc=typeof window!=='undefined'&&window.__diagnosis?window.__diagnosis.yesCount:-1
            if(yc<0)return null
            const msg=yc>=2
              ?'先ほど複数当てはまっていたので、\n今回の構造はかなりハマる状態です'
              :yc===1
              ?'一部ズレがあるので、\nそこを整えるだけでも効果が出ます'
              :'現状かなり整っているので、\nさらに伸ばすフェーズですね'
            return<div style={{background:'rgba(196,151,62,0.06)',border:`1px solid ${C.goldDim}`,borderRadius:4,padding:'12px 14px'}}>
              <div style={{fontFamily:FM,fontSize:9,color:C.gold,letterSpacing:'0.18em',marginBottom:8}}>CLOSING GUIDE</div>
              <pre style={{fontFamily:FB,fontSize:12,color:C.textMid,lineHeight:1.75,margin:0,whiteSpace:'pre-wrap'}}>{msg}</pre>
            </div>
          })()}
          <div style={{background:'#181614',border:'1px solid #2a2520',borderRadius:4,padding:'clamp(12px,2vw,16px)'}}>
            <div style={{fontFamily:FM,fontSize:9,color:C.gold,letterSpacing:'0.18em',marginBottom:12}}>KEY POINTS</div>
            {sec.points.map((p,i)=><div key={i} style={{display:'flex',gap:8,alignItems:'flex-start',padding:'8px 0',borderBottom:i<sec.points.length-1?'1px solid #2a2520':'none'}}><span style={{color:C.gold,flexShrink:0,marginTop:1}}>▸</span><span style={{fontSize:12,color:C.textMid,lineHeight:1.65}}>{p}</span></div>)}
          </div>
          {sec.watch&&<div style={{background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:4,padding:'clamp(12px,2vw,16px)'}}>
            <div style={{fontFamily:FM,fontSize:9,color:C.pRed,letterSpacing:'0.18em',marginBottom:8}}>WATCH OUT</div>
            <div style={{fontSize:12,color:'#fca5a5',lineHeight:1.7}}>{sec.watch}</div>
          </div>}
          {cur<P_SECTIONS.length-1&&<div style={{background:'#181614',border:'1px solid #2a2520',borderRadius:4,padding:'clamp(10px,1.5vw,14px)'}}>
            <div style={{fontFamily:FM,fontSize:9,color:C.textDim,letterSpacing:'0.15em',marginBottom:6}}>NEXT</div>
            <div style={{fontSize:12,color:C.textMid}}>{P_SECTIONS[cur+1].label}</div>
          </div>}
        </div>
      </div>
    </div>
    {/* 下部ナビ */}
    <div style={{position:'sticky',bottom:0,background:'#181614',borderTop:'1px solid #2a2520',padding:'clamp(10px,2vw,14px) clamp(12px,3vw,24px)',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
      <button onClick={()=>go(-1)} disabled={cur===0} style={{fontFamily:FM,fontSize:11,letterSpacing:'0.1em',padding:'clamp(8px,1.5vw,10px) clamp(16px,2.5vw,24px)',background:cur===0?'transparent':'#181614',color:cur===0?C.textDim:C.text,border:`1px solid ${cur===0?'#2a2520':C.gold}`,borderRadius:2,cursor:cur===0?'default':'pointer'}}>← 前へ</button>
      <div style={{display:'flex',gap:5,flexWrap:'wrap',justifyContent:'center',maxWidth:'55%'}}>
        {P_SECTIONS.map((_,i)=><div key={i} onClick={()=>jumpTo(i)} style={{width:cur===i?20:7,height:7,borderRadius:3.5,background:cur===i?C.gold:done.has(P_SECTIONS[i].id)?'#22c55e':'#2a2520',cursor:'pointer',transition:'all 0.25s',flexShrink:0}}/>)}
      </div>
      <button onClick={()=>go(1)} disabled={cur===P_SECTIONS.length-1} style={{fontFamily:FM,fontSize:11,letterSpacing:'0.1em',padding:'clamp(8px,1.5vw,10px) clamp(16px,2.5vw,24px)',background:cur===P_SECTIONS.length-1?'transparent':`linear-gradient(135deg,${C.gold},#e8c060)`,color:cur===P_SECTIONS.length-1?C.textDim:C.bg,border:'none',borderRadius:2,cursor:cur===P_SECTIONS.length-1?'default':'pointer',fontWeight:600}}>次へ →</button>
    </div>
  </div>
}

function CustomerView(){
  const sectionRefs=useRef({});const[,setActive]=useState('hero')
  useSyncReceive(useRef((id)=>{const el=sectionRefs.current[id];if(el)el.scrollIntoView({behavior:'smooth'})}).current)
  useEffect(()=>{
    const IDS=['hero','check','fracture','comparison','service','usp','process','track','benefit','contact']
    const fn=()=>{for(const id of IDS){const el=sectionRefs.current[id];if(el){const r=el.getBoundingClientRect();if(r.top<=window.innerHeight*0.5&&r.bottom>=window.innerHeight*0.5){setActive(id);break}}}}
    window.addEventListener('scroll',fn,{passive:true});return()=>window.removeEventListener('scroll',fn)
  },[])
  const r=(id)=>(el)=>{sectionRefs.current[id]=el}
  return<div style={{background:C.bg,minHeight:'100vh',overflowX:'hidden'}}>
    <ProgressBar/>
    <Hero sRef={r('hero')}/>
    <SelfCheck sRef={r('check')}/>
    <Fracture sRef={r('fracture')}/>
    <Comparison sRef={r('comparison')}/>
    <Service sRef={r('service')}/>
    <USP sRef={r('usp')}/>
    <Process sRef={r('process')}/>
    <Track sRef={r('track')}/>
    <Benefit sRef={r('benefit')}/>
    <Closing sRef={r('contact')}/>
  </div>
}

export default function App(){
  const isPresenter=window.location.pathname==='/presenter'
  return isPresenter?<PresenterView/>:<CustomerView/>
}
