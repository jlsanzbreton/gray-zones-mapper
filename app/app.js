// Gray Zones Mapper: lógica de la matriz (ES/EN).
(function(){
  // ---------- Textos (es / en) ----------
  var T={
    es:{
      title:'Gray Zones Mapper · Matriz',
      back:'← Qué es Gray Zones',
      intro:'Cuatro zonas grises, un código de cuatro cifras y una recta que muestra dónde cojea el proyecto. Elige un número por zona y mira cómo se mueve.',
      examples:'Ejemplos', langGroup:'Idioma', legal:'Aviso legal y privacidad', legalHref:'/legal/',
      guideH:'Cómo leer la recta',
      guideP:'Cada pareja de números da un punto: la mitad 1 junta Over-reliance y Ownership, la mitad 2 junta Uncertainty y Constraints. La recta que une los dos puntos cuenta lo que ni el código ni un solo punto dicen: si las dos mitades coinciden o se contradicen, y en qué.',
      note:'Es una heurística para provocar la conversación, no una medida. Que un proyecto sume 12 no lo condena y sumar 4 no garantiza nada: solo indica hacia dónde se inclinan las probabilidades. La suma resume, pero un solo 3 ya es una alerta aunque el total sea moderado. La lectura de las dos mitades es una hipótesis de trabajo para probar con casos reales.',
      zones:{
        OR:{q:'¿Qué elementos críticos estamos dando por sentado que funcionarán según lo previsto?',
            d:{1:'Uno o ningún elemento crítico dado por sentado.',2:'2 elementos críticos dados por sentado.',3:'3 o más: lo que siempre funcionó y no se audita.'}},
        OW:{q:'¿Qué fronteras entre sistemas necesitan dueño y no lo tienen?',
            d:{1:'Una o ninguna frontera sin dueño.',2:'2 fronteras sin dueño.',3:'3 o más fronteras sin dueño.'}},
        UN:{q:'¿Qué zonas de incertidumbre estamos asumiendo sin escrutinio?',
            d:{1:'Una o ninguna zona de incertidumbre sin escrutar.',2:'2 zonas de incertidumbre sin escrutar.',3:'3 o más: es jugar a la ruleta rusa.'}},
        CO:{q:'¿Qué límites afectarán a nuestro juicio?',
            d:{1:'Uno o ninguno de los límites importantes (tiempo, dinero, personas). Lo ideal.',2:'2 límites importantes. Aceptable.',3:'3 límites importantes. Hay que reducirlos como sea.'}}
      },
      presets:{'3121':'Migración confiada · conocimiento','1213':'Fusión de equipos · estructura','3333':'Peor caso','1111':'Mejor caso'},
      H1:'mitad 1 (Over-reliance + Ownership)', H2:'mitad 2 (Uncertainty + Constraints)',
      tiles:[
        ['Un punto','Las dos mitades coinciden: diagnóstico coherente. Lo que importa es en qué casilla cae.'],
        ['Horizontal','Over-reliance y Uncertainty van a la par. Desentonan Ownership y Constraints: la estructura frente a la presión.'],
        ['Vertical','Ownership y Constraints van a la par. Desentonan Over-reliance y Uncertainty: lo que se sabe frente a lo que se da por sentado.'],
        ['Paralela a la diagonal','Mismo tipo de problema, distinta gravedad: una mitad está mucho peor que la otra.'],
        ['Cruza la diagonal','Misma gravedad, distinto tipo: una mitad falla por conocimiento y la otra por estructura.'],
        ['Inclinada','Las dos diferencias a la vez. Pesa más la que tenga más recorrido, horizontal o vertical.']
      ],
      tryBtn:'Probar', mapAria:'Mapa con el código ', mitigation:'mitigación',
      side:function(s){return s>0?'el conocimiento (lo que se sabe o se da por sentado)':(s<0?'la estructura (dueños y límites)':'ninguno de los dos lados (está equilibrada)');},
      hDir:function(dx){return dx<0?'La falta de dueño pesa más que las constraints: el problema es más de organización que de presión.':'Las constraints pesan más que la falta de dueño: hay más presión que desorganización.';},
      vDir:function(dy){return dy>0?'Predominan las zonas de incertidumbre sin escrutar sobre lo dado por sentado.':'Predomina lo dado por sentado (lo que siempre funcionó) sobre las zonas de incertidumbre.';},
      shape:{
        point:['Un punto','Las dos mitades cuentan la misma historia, así que el diagnóstico es coherente. Lo que importa es en qué casilla cae.'],
        horiz:['Horizontal','Over-reliance y Uncertainty van a la par. Lo que desentona es Ownership frente a Constraints, la estructura frente a la presión. '],
        vert:['Vertical','Ownership y Constraints van a la par. Lo que desentona es Over-reliance frente a Uncertainty, lo dado por sentado frente a lo no resuelto. '],
        par:function(worse,better){return ['Paralela a la diagonal','Las dos mitades tienen el mismo tipo de problema pero distinta gravedad. La '+worse+' está peor que la '+better+'.'];},
        cross:function(a,b,H1,H2){return ['Cruza la diagonal','Misma gravedad, distinto tipo de problema. La '+H1+' falla sobre todo en '+a+'; la '+H2+', en '+b+'.'];},
        slant:function(horizontal,dirTxt){return ['Inclinada','Las dos mitades difieren a la vez en estructura (Ownership frente a Constraints) y en conocimiento (Over-reliance frente a Uncertainty). Pesa más la diferencia '+(horizontal?'horizontal. ':'vertical. ')+dirTxt];}
      },
      near:['Cerca de «ok»','En la zona intermedia','Cerca de «No»'],
      lado:['Por encima de la diagonal: el problema pesa más en el <strong>conocimiento</strong> (lo que se da por sentado y lo que no se ha resuelto).',
            'Sobre la diagonal: el problema está equilibrado entre conocimiento y estructura.',
            'Por debajo de la diagonal: el problema pesa más en la <strong>estructura</strong> (dueños y límites).'],
      tag:{bad:'Prioridad',mid:'Vigilar',ok:'En orden',acc:'Aceptable'},
      moves:{
        OR:['auditar lo que se da por sentado y no se revisa.','revisar lo que siempre ha funcionado.'],
        OW:['nombrar un dueño para cada frontera clave.','quedan fronteras clave sin dueño.'],
        UN:['escrutar o mitigar las zonas de incertidumbre asumidas.','quedan zonas de incertidumbre sin escrutar.'],
        CO:['bajar a dos o a una, o neutralizar su efecto sobre el juicio.','dos es aceptable, una es lo ideal.']
      },
      rule:'Regla del 3:', noAlerts:'ninguna alerta.',
      alerts:{OR:'tres o más cosas dadas por sentado: más fácil que haya problemas',OW:'tres o más fronteras sin dueño: problema',UN:'tres o más zonas de incertidumbre asumidas: ruleta rusa',CO:'tres límites importantes: hay que reducirlos',OW1:'una o ninguna frontera sin dueño: casi todo bien'},
      balH:'Balance', know:'conocimiento', struct:'estructura',
      foco:['Sin desajuste','Desajuste moderado','Desajuste serio'],
      levelH:'Nivel de gris', points:'puntos de 12', ideal:'· lo ideal es 4',
      focusH:'Foco', movesH:'Para llegar a 4 puntos'
    },
    en:{
      title:'Gray Zones Mapper · Matrix',
      back:'← What is Gray Zones',
      intro:'Four gray zones, a four-digit code and a line that shows where the project is limping. Pick a number for each zone and watch it move.',
      examples:'Examples', langGroup:'Language', legal:'Legal notice & privacy', legalHref:'/en/legal/',
      guideH:'How to read the line',
      guideP:'Each pair of numbers gives a point: the first half combines Over-reliance and Ownership, the second combines Uncertainty and Constraints. The line joining the two points tells you what neither the code nor a single point can: whether the two halves agree or contradict each other, and where.',
      note:'This is a heuristic to spark the conversation, not a measurement. A project scoring 12 is not doomed, and scoring 4 guarantees nothing: it only shows which way the odds lean. The total summarises, but a single 3 is already a warning even if the total is moderate. The reading of the two halves is a working hypothesis to test against real cases.',
      zones:{
        OR:{q:'Which critical elements are we taking for granted will work as planned?',
            d:{1:'One or no critical element taken for granted.',2:'2 critical elements taken for granted.',3:'3 or more: what has always worked and never gets audited.'}},
        OW:{q:'Which boundaries between systems need an owner and don’t have one?',
            d:{1:'One or no boundary without an owner.',2:'2 boundaries without an owner.',3:'3 or more boundaries without an owner.'}},
        UN:{q:'Which areas of uncertainty are we assuming without scrutiny?',
            d:{1:'One or no area of uncertainty left unscrutinised.',2:'2 areas of uncertainty left unscrutinised.',3:'3 or more: it’s playing Russian roulette.'}},
        CO:{q:'Which limits will affect our judgement?',
            d:{1:'One or none of the major limits (time, money, people). Ideal.',2:'2 major limits. Acceptable.',3:'3 major limits. They must be reduced, whatever it takes.'}}
      },
      presets:{'3121':'Overconfident migration · knowledge','1213':'Team merger · structure','3333':'Worst case','1111':'Best case'},
      H1:'first half (Over-reliance + Ownership)', H2:'second half (Uncertainty + Constraints)',
      tiles:[
        ['A point','Both halves agree: a coherent diagnosis. What matters is which cell it lands in.'],
        ['Horizontal','Over-reliance and Uncertainty are level. Ownership and Constraints differ: structure versus pressure.'],
        ['Vertical','Ownership and Constraints are level. Over-reliance and Uncertainty differ: what is known versus what is taken for granted.'],
        ['Parallel to the diagonal','Same kind of problem, different severity: one half is much worse than the other.'],
        ['Crosses the diagonal','Same severity, different kind: one half fails on knowledge, the other on structure.'],
        ['Slanted','Both differences at once. Whichever runs further, horizontal or vertical, weighs more.']
      ],
      tryBtn:'Try', mapAria:'Map for code ', mitigation:'mitigation',
      side:function(s){return s>0?'knowledge (what is known or taken for granted)':(s<0?'structure (owners and limits)':'neither side (it is balanced)');},
      hDir:function(dx){return dx<0?'Missing ownership weighs more than constraints: the problem is more about organisation than pressure.':'Constraints weigh more than missing ownership: there is more pressure than disorganisation.';},
      vDir:function(dy){return dy>0?'Unscrutinised areas of uncertainty outweigh what is taken for granted.':'What is taken for granted (what has always worked) outweighs the areas of uncertainty.';},
      shape:{
        point:['A point','Both halves tell the same story, so the diagnosis is coherent. What matters is which cell it lands in.'],
        horiz:['Horizontal','Over-reliance and Uncertainty are level. What stands out is Ownership versus Constraints, structure versus pressure. '],
        vert:['Vertical','Ownership and Constraints are level. What stands out is Over-reliance versus Uncertainty, what is taken for granted versus what is unresolved. '],
        par:function(worse,better){return ['Parallel to the diagonal','Both halves have the same kind of problem but different severity. The '+worse+' is worse than the '+better+'.'];},
        cross:function(a,b,H1,H2){return ['Crosses the diagonal','Same severity, different kind of problem. The '+H1+' fails mainly on '+a+'; the '+H2+', on '+b+'.'];},
        slant:function(horizontal,dirTxt){return ['Slanted','The two halves differ at once in structure (Ownership versus Constraints) and in knowledge (Over-reliance versus Uncertainty). The '+(horizontal?'horizontal':'vertical')+' difference weighs more. '+dirTxt];}
      },
      near:['Close to “ok”','In the middle zone','Close to “No”'],
      lado:['Above the diagonal: the problem weighs more on <strong>knowledge</strong> (what is taken for granted and what is unresolved).',
            'On the diagonal: the problem is balanced between knowledge and structure.',
            'Below the diagonal: the problem weighs more on <strong>structure</strong> (owners and limits).'],
      tag:{bad:'Priority',mid:'Watch',ok:'In order',acc:'Acceptable'},
      moves:{
        OR:['audit what is taken for granted and never reviewed.','review what has always worked.'],
        OW:['name an owner for every key boundary.','some key boundaries still have no owner.'],
        UN:['scrutinise or mitigate the areas of uncertainty being assumed.','some areas of uncertainty remain unscrutinised.'],
        CO:['bring them down to two or one, or neutralise their effect on judgement.','two is acceptable, one is ideal.']
      },
      rule:'Rule of 3:', noAlerts:'no alerts.',
      alerts:{OR:'three or more things taken for granted: problems become more likely',OW:'three or more boundaries without an owner: a problem',UN:'three or more areas of uncertainty assumed: Russian roulette',CO:'three major limits: they must be reduced',OW1:'one or no boundary without an owner: almost all good'},
      balH:'Balance', know:'knowledge', struct:'structure',
      foco:['No mismatch','Moderate mismatch','Serious mismatch'],
      levelH:'Gray level', points:'points out of 12', ideal:'· ideal is 4',
      focusH:'Focus', movesH:'To get to 4 points'
    }
  };

  var ZONES=[{k:'OR',name:'Over-reliance'},{k:'OW',name:'Ownership'},{k:'UN',name:'Uncertainty'},{k:'CO',name:'Constraints'}];
  var PRESET_CODES=['3121','1213','3333','1111'];
  var TILE_CODES=['3333','3332','1131','3311','3113','2311'];
  var uid=0, code='3121', lang='es', L=T.es;

  function lv(ch){return parseInt(ch,10);}
  function vals(c){return {OR:lv(c[0]),OW:lv(c[1]),UN:lv(c[2]),CO:lv(c[3])};}
  function geo(v){
    var x1=v.OW,y1=v.OR,x2=v.CO,y2=v.UN;
    return {x1:x1,y1:y1,x2:x2,y2:y2,dx:x2-x1,dy:y2-y1,mx:(x1+x2)/2,my:(y1+y2)/2};
  }

  function drawSquare(c,mini){
    var id='u'+(++uid), v=vals(c), g=geo(v);
    var W=mini?160:560, H=mini?160:530;
    var S=mini?120:300, Lf=mini?20:130, T0=mini?20:105, cs=S/3;
    function X(gx){return Lf+gx*cs;} function Y(gy){return T0+S-gy*cs;}
    var s='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+L.mapAria+c+'" xmlns="http://www.w3.org/2000/svg">';
    s+='<defs><pattern id="h'+id+'" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line class="hatch-l" x1="0" y1="0" x2="0" y2="9"/></pattern>'+
       '<marker id="mi'+id+'" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="f-ink" d="M0 0L10 5L0 10z"/></marker>'+
       '<marker id="mg'+id+'" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path class="f-good" d="M0 0L10 5L0 10z"/></marker></defs>';
    s+='<rect class="cell-bad" x="'+X(2)+'" y="'+Y(3)+'" width="'+cs+'" height="'+cs+'"/>';
    s+='<rect x="'+X(2)+'" y="'+Y(3)+'" width="'+cs+'" height="'+cs+'" fill="url(#h'+id+')"/>';
    s+='<rect class="cell-ok" x="'+X(0)+'" y="'+Y(1)+'" width="'+cs+'" height="'+cs+'"/>';
    for(var i=1;i<3;i++){
      s+='<line class="dash" x1="'+X(i)+'" y1="'+T0+'" x2="'+X(i)+'" y2="'+(T0+S)+'"/>';
      s+='<line class="dash" x1="'+Lf+'" y1="'+Y(i)+'" x2="'+(Lf+S)+'" y2="'+Y(i)+'"/>';
    }
    s+='<rect class="frame" x="'+Lf+'" y="'+T0+'" width="'+S+'" height="'+S+'"/>';
    s+='<line class="'+(mini?'mit-mini':'mit')+'" x1="'+X(1.95)+'" y1="'+Y(1.95)+'" x2="'+X(0.65)+'" y2="'+Y(0.65)+'" marker-end="url(#mg'+id+')"/>';
    if(!mini){
      s+='<text class="cell-t" style="fill:var(--bad)" x="'+X(2.5)+'" y="'+(Y(3)+26)+'">No</text>';
      s+='<text class="cell-t" style="fill:var(--good)" x="'+X(0.5)+'" y="'+(Y(0)-14)+'">ok</text>';
      s+='<text style="font:500 14px var(--body);fill:var(--good)" text-anchor="middle" transform="translate('+X(1.62)+','+Y(1.0)+') rotate(-45)">'+L.mitigation+'</text>';
      for(var i2=0;i2<3;i2++){
        var l=String(i2+1);
        s+='<text class="ab'+(v.OR==i2+1?' sel':'')+'" x="'+(Lf+S+24)+'" y="'+Y(i2+.5)+'">'+l+'</text>';
        s+='<text class="ab'+(v.UN==i2+1?' sel':'')+'" x="'+(Lf-24)+'" y="'+Y(i2+.5)+'">'+l+'</text>';
        s+='<text class="ab'+(v.OW==i2+1?' sel':'')+'" x="'+X(i2+.5)+'" y="'+(T0-18)+'">'+l+'</text>';
        s+='<text class="ab'+(v.CO==i2+1?' sel':'')+'" x="'+X(i2+.5)+'" y="'+(T0+S+28)+'">'+l+'</text>';
      }
      s+='<line class="axis" x1="'+Lf+'" y1="'+(T0-40)+'" x2="'+(Lf+S)+'" y2="'+(T0-40)+'" marker-end="url(#mi'+id+')"/>';
      s+='<line class="axis" x1="'+(Lf+S+48)+'" y1="'+(T0+S)+'" x2="'+(Lf+S+48)+'" y2="'+T0+'" marker-end="url(#mi'+id+')"/>';
      s+='<line class="axis" x1="'+(Lf-48)+'" y1="'+(T0+S)+'" x2="'+(Lf-48)+'" y2="'+T0+'" marker-end="url(#mi'+id+')"/>';
      s+='<line class="axis" x1="'+Lf+'" y1="'+(T0+S+52)+'" x2="'+(Lf+S)+'" y2="'+(T0+S+52)+'" marker-end="url(#mi'+id+')"/>';
      s+='<text class="zl" x="'+(Lf+S/2)+'" y="'+(T0-68)+'">Ownership</text>';
      s+='<text class="zl" x="'+(Lf+S/2)+'" y="'+(T0+S+90)+'">Constraints</text>';
      s+='<text class="zl" transform="translate('+(Lf+S+84)+','+(T0+S/2)+') rotate(90)">Over-reliance</text>';
      s+='<text class="zl" transform="translate('+(Lf-84)+','+(T0+S/2)+') rotate(-90)">Uncertainty</text>';
    }
    var p1x=X(g.x1-.5), p1y=Y(g.y1-.5), p2x=X(g.x2-.5), p2y=Y(g.y2-.5);
    if(!mini){
      s+='<line class="proj" x1="'+p1x+'" y1="'+p1y+'" x2="'+(Lf+S+10)+'" y2="'+p1y+'"/>';
      s+='<line class="proj" x1="'+p1x+'" y1="'+p1y+'" x2="'+p1x+'" y2="'+(T0-10)+'"/>';
      s+='<line class="proj" x1="'+p2x+'" y1="'+p2y+'" x2="'+(Lf-10)+'" y2="'+p2y+'"/>';
      s+='<line class="proj" x1="'+p2x+'" y1="'+p2y+'" x2="'+p2x+'" y2="'+(T0+S+10)+'"/>';
    }
    s+='<line class="seg-line'+(mini?' mini':'')+'" x1="'+p1x+'" y1="'+p1y+'" x2="'+p2x+'" y2="'+p2y+'"/>';
    var r=mini?8:17;
    if(p1x===p2x && p1y===p2y){
      s+='<circle class="pt" cx="'+p1x+'" cy="'+p1y+'" r="'+(mini?10:20)+'"/><text class="pt-t'+(mini?' mini':'')+'" x="'+p1x+'" y="'+p1y+'">1·2</text>';
    }else{
      s+='<circle class="pt" cx="'+p1x+'" cy="'+p1y+'" r="'+r+'"/><text class="pt-t'+(mini?' mini':'')+'" x="'+p1x+'" y="'+p1y+'">1</text>';
      s+='<circle class="pt" cx="'+p2x+'" cy="'+p2y+'" r="'+r+'"/><text class="pt-t'+(mini?' mini':'')+'" x="'+p2x+'" y="'+p2y+'">2</text>';
    }
    return s+'</svg>';
  }

  function sgn(n){return n>0?1:(n<0?-1:0);}
  function shape(g){
    var dx=g.dx, dy=g.dy, S=L.shape, r;
    if(dx===0&&dy===0) r=S.point;
    else if(dy===0) r=[S.horiz[0],S.horiz[1]+L.hDir(dx)];
    else if(dx===0) r=[S.vert[0],S.vert[1]+L.vDir(dy)];
    else if(dx===dy) r=dx>0?S.par(L.H2,L.H1):S.par(L.H1,L.H2);
    else if(dx===-dy) r=S.cross(L.side(sgn(g.y1-g.x1)),L.side(sgn(g.y2-g.x2)),L.H1,L.H2);
    else { var h=Math.abs(dx)>Math.abs(dy); r=S.slant(h,h?L.hDir(dx):L.vDir(dy)); }
    return {t:r[0],x:r[1]};
  }

  function position(g){
    var s=(g.mx+g.my)/2, pct=(s-1)/2*100, d=g.my-g.mx;
    var near=s<1.34?L.near[0]:(s>2.66?L.near[2]:L.near[1]);
    var lado=d>0.25?L.lado[0]:(d<-0.25?L.lado[2]:L.lado[1]);
    return {pct:pct,near:near,lado:lado};
  }

  function moves(v){
    var items=[];
    function it(state,label,txt){items.push('<li><span class="tag '+state+'">'+label+'</span><span>'+txt+'</span></li>');}
    ZONES.forEach(function(z){
      var n=v[z.k], m=L.moves[z.k], name='<strong>'+z.name+'</strong>';
      if(n===3) it('t-bad',L.tag.bad,name+': '+m[0]);
      else if(n===2) it('t-mid',z.k==='CO'?L.tag.acc:L.tag.mid,name+': '+m[1]);
      else it('t-ok',L.tag.ok,name+'.');
    });
    return '<ul class="list">'+items.join('')+'</ul>';
  }

  function alerts(v){
    var a=[];
    ZONES.forEach(function(z){ if(v[z.k]===3) a.push(L.alerts[z.k]); });
    if(v.OW===1) a.push(L.alerts.OW1);
    return '<p class="alerts"><strong>'+L.rule+'</strong> '+(a.length?a.join('; ')+'.':L.noAlerts)+'</p>';
  }

  function balHTML(v,ps){
    var K=v.OR+v.UN, E=v.OW+v.CO;
    return '<h2><span class="num">II</span>'+L.balH+'</h2><p class="total"><strong>'+K+'</strong> '+L.know+' <span>· Over-reliance + Uncertainty</span></p><p class="total"><strong>'+E+'</strong> '+L.struct+' <span>· Ownership + Constraints</span></p><p>'+ps.lado+'</p>';
  }
  function focoLevel(g){
    var m=Math.max(Math.abs(g.dx),Math.abs(g.dy));
    return L.foco[Math.min(m,2)];
  }

  var fig=document.getElementById('fig');
  function render(){
    var v=vals(code), g=geo(v), sh=shape(g), ps=position(g), tot=v.OR+v.OW+v.UN+v.CO;
    ZONES.forEach(function(z,i){
      var ch=code[i], r=document.getElementById('r-'+z.k+'-'+ch);
      if(r) r.checked=true;
      document.getElementById('d-'+z.k).textContent=ch+' · '+L.zones[z.k].d[ch];
    });
    document.querySelectorAll('#presets .pill').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.code===code?'true':'false');});
    fig.innerHTML=drawSquare(code,false);
    document.getElementById('c-pos').innerHTML=
      '<h2><span class="num">I</span>'+L.levelH+'</h2><p class="codebig">'+code+'</p><p class="sub">Over-reliance · Ownership · Uncertainty · Constraints</p><p class="total"><strong>'+tot+'</strong> '+L.points+' <span>'+L.ideal+'</span></p>'+
      '<div class="bar"><i style="left:'+ps.pct.toFixed(1)+'%"></i></div><div class="barlabels"><span>ok</span><span>No</span></div>'+
      '<p><span class="shape-name">'+ps.near+'.</span></p>';
    document.getElementById('c-bal').innerHTML=balHTML(v,ps);
    document.getElementById('c-shape').innerHTML=
      '<h2><span class="num">III</span>'+L.focusH+'</h2><p class="shape-name">'+focoLevel(g)+' · '+sh.t+'</p><p>'+sh.x+'</p>';
    document.getElementById('c-move').innerHTML='<h2>'+L.movesH+'</h2>'+moves(v)+alerts(v);
  }

  function setCode(c){
    code=c; render();
    try{ if(location.hash.slice(1)!==c) location.hash=c; }catch(e){}
  }

  // ---------- Construcción de la interfaz (se rehace al cambiar de idioma) ----------
  var ctl=document.getElementById('controls'), pr=document.getElementById('presets'), tl=document.getElementById('tiles');
  function build(){
    var html='';
    ZONES.forEach(function(z){
      html+='<fieldset class="zone"><legend>'+z.name+'</legend><p class="q">'+L.zones[z.k].q+'</p><div class="seg" role="radiogroup" aria-label="'+z.name+'">';
      ['1','2','3'].forEach(function(l){
        html+='<div class="opt"><input type="radio" name="g-'+z.k+'" id="r-'+z.k+'-'+l+'" value="'+l+'"><label for="r-'+z.k+'-'+l+'">'+l+'</label></div>';
      });
      html+='</div><p class="desc" id="d-'+z.k+'"></p></fieldset>';
    });
    ctl.innerHTML=html;

    html='';
    PRESET_CODES.forEach(function(c){ html+='<button type="button" class="pill" data-code="'+c+'" aria-pressed="false">'+L.presets[c]+'<b>'+c+'</b></button>'; });
    pr.innerHTML=html;
    pr.setAttribute('aria-label',L.examples);

    html='';
    TILE_CODES.forEach(function(c,i){
      html+='<div class="tile">'+drawSquare(c,true)+'<h3>'+L.tiles[i][0]+'</h3><p>'+L.tiles[i][1]+'</p><button type="button" class="pill" data-code="'+c+'">'+L.tryBtn+'<b>'+c+'</b></button></div>';
    });
    tl.innerHTML=html;

    document.querySelectorAll('[data-i18n]').forEach(function(el){ el.textContent=L[el.getAttribute('data-i18n')]; });
    document.getElementById('lang').setAttribute('aria-label',L.langGroup);
    document.querySelectorAll('#lang button').forEach(function(b){ b.setAttribute('aria-pressed',b.dataset.lang===lang?'true':'false'); });
    document.documentElement.lang=lang;
    document.querySelector('.back').setAttribute('href',lang==='en'?'/en/':'/');
    var lg=document.querySelector('.foot .legal'); lg.textContent=L.legal; lg.setAttribute('href',L.legalHref);
    document.title=L.title;
  }

  function setLang(l, persist){
    lang=T[l]?l:'es'; L=T[lang];
    if(persist){
      try{ localStorage.setItem('gzm-lang',lang); }catch(e){}
      try{ var u=new URL(location.href); u.searchParams.set('lang',lang); history.replaceState(null,'',u.pathname+u.search+u.hash); }catch(e){}
    }
    build(); render();
  }

  ctl.addEventListener('change',function(e){
    var t=e.target; if(!t||t.type!=='radio') return;
    var i=-1; ZONES.forEach(function(z,k){ if(t.name==='g-'+z.k) i=k; });
    if(i<0) return;
    var a=code.split(''); a[i]=t.value; setCode(a.join(''));
  });
  pr.addEventListener('click',function(e){ var b=e.target.closest('.pill'); if(b) setCode(b.dataset.code); });
  tl.addEventListener('click',function(e){
    var b=e.target.closest('.pill'); if(!b) return;
    setCode(b.dataset.code);
    document.getElementById('top').scrollIntoView();
  });
  document.getElementById('lang').addEventListener('click',function(e){
    var b=e.target.closest('button'); if(b) setLang(b.dataset.lang,true);
  });

  function fromHash(){
    var h=(location.hash||'').slice(1);
    return /^[123]{4}$/.test(h)?h:null;
  }
  function initialLang(){
    try{ var q=new URL(location.href).searchParams.get('lang'); if(q&&T[q]) return q; }catch(e){}
    try{ var s=localStorage.getItem('gzm-lang'); if(s&&T[s]) return s; }catch(e){}
    var n=(navigator.language||'es').toLowerCase();
    return n.indexOf('es')===0?'es':'en';
  }
  window.addEventListener('hashchange',function(){ var h=fromHash(); if(h&&h!==code){code=h;render();} });
  var h0=fromHash(); if(h0) code=h0;
  setLang(initialLang(),false);
})();
