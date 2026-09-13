/*
  PackVerse 27 — curated FC 27 launch dataset.
  Ratings/stats are a practical launch sample used by the simulator, not a mirror of EA's entire 21k+ database.
  The app is intentionally data-driven: replace/extend PLAYERS without touching UI logic.
*/
(function(){
  const P=(name,pos,ovr,pac,sho,pas,dri,def,phy,nation,club,price)=>({name,pos,ovr,pac,sho,pas,dri,def,phy,nation,club,price});
  const raw=[
    P("Kylian Mbappé","DC",91,96,91,80,92,29,76,"Francia","Real Madrid",2900000),
    P("Erling Haaland","DC",91,87,92,71,80,47,89,"Noruega","Manchester City",430000),
    P("Thibaut Courtois","POR",90,87,89,78,90,46,90,"Bélgica","Real Madrid",60000),
    P("Jude Bellingham","MCO",90,79,86,83,88,79,85,"Inglaterra","Real Madrid",320000),
    P("Gianluigi Donnarumma","POR",89,90,83,72,90,46,88,"Italia","Manchester City",50000),
    P("Jan Oblak","POR",88,85,90,79,87,46,86,"Eslovenia","Atlético de Madrid",35000),
    P("Alexia Putellas","MC",91,80,90,91,92,72,75,"España","FC Barcelona",380000),
    P("Ousmane Dembélé","DC",90,90,89,83,93,55,70,"Francia","PSG",980000),
    P("Lamine Yamal","ED",90,86,84,87,93,38,61,"España","FC Barcelona",480000),
    P("Pedri","MC",90,76,75,89,91,77,75,"España","FC Barcelona",210000),
    P("Vitinha","MC",90,72,81,88,91,75,70,"Portugal","PSG",130000),
    P("Michael Olise","MD",90,83,82,89,91,47,69,"Francia","Bayern München",240000),
    P("Rodri","MCD",90,62,78,86,81,85,81,"España","Manchester City",80000),
    P("Harry Kane","DC",90,62,94,83,82,49,83,"Inglaterra","Bayern München",75000),
    P("Aitana Bonmatí","MC",90,79,84,89,91,77,76,"España","FC Barcelona",290000),
    P("Khadija Shaw","DC",90,79,90,71,81,42,88,"Jamaica","Manchester City",85000),
    P("Vini Jr.","EI",89,93,85,80,91,31,71,"Brasil","Real Madrid",720000),
    P("Bruno Fernandes","MCO",89,67,85,92,85,68,75,"Portugal","Manchester United",85000),
    P("Caroline Graham Hansen","ED",89,88,87,88,90,47,76,"Noruega","FC Barcelona",340000),
    P("Khvicha Kvaratskhelia","EI",89,86,85,84,90,59,81,"Georgia","PSG",250000),
    P("Lionel Messi","MCO",89,76,87,89,90,33,63,"Argentina","Inter Miami",125000),
    P("Nuno Mendes","LI",89,94,77,80,86,84,80,"Portugal","PSG",250000),
    P("Gabriel","DFC",89,64,44,64,66,91,84,"Brasil","Arsenal",110000),
    P("Willian Pacho","DFC",89,80,34,63,65,90,86,"Ecuador","PSG",170000),
    P("Mariona Caldentey","MC",89,79,85,86,90,78,82,"España","Arsenal",115000),
    P("William Saliba","DFC",88,77,41,68,73,90,82,"Francia","Arsenal",185000),
    P("Mapi León","DFC",88,77,68,80,77,89,86,"España","FC Barcelona",95000),
    P("Virgil van Dijk","DFC",88,70,60,72,70,89,85,"Países Bajos","Liverpool",190000),
    P("Raphinha","EI",88,91,86,85,87,54,76,"Brasil","FC Barcelona",190000),
    P("Achraf Hakimi","LD",88,92,79,81,82,82,81,"Marruecos","PSG",155000),
    P("João Neves","MC",88,72,75,84,87,86,82,"Portugal","PSG",105000),
    P("Declan Rice","MCD",88,72,75,86,81,85,84,"Inglaterra","Arsenal",85000),
    P("Patri Guijarro","MCD",88,78,82,83,88,84,88,"España","FC Barcelona",90000),
    P("Yui Hasegawa","MCD",88,77,71,86,88,81,68,"Japón","Manchester City",60000),
    P("Klara Bühl","MI",88,84,85,85,86,37,74,"Alemania","Bayern München",70000),
    P("Barbra Banda","DC",88,92,84,64,80,33,82,"Zambia","Orlando Pride",90000),
    P("Bukayo Saka","ED",87,79,82,85,87,60,73,"Inglaterra","Arsenal",95000),
    P("Nicolò Barella","MC",87,77,78,84,86,81,72,"Italia","Inter",55000),
    P("Marquinhos","DFC",87,74,56,75,73,89,78,"Brasil","PSG",50000),
    P("Rúben Dias","DFC",87,58,44,69,69,87,83,"Portugal","Manchester City",30000),
    P("Nico Schlotterbeck","DFC",87,81,60,76,74,86,84,"Alemania","Borussia Dortmund",75000),
    P("Dayot Upamecano","DFC",87,80,45,65,75,86,83,"Francia","Bayern München",70000),
    P("Tabitha Chawinga","EI",87,94,83,76,86,36,81,"Malaui","Lyon",95000),
    P("Salma Paralluelo","EI",87,93,84,79,85,46,78,"España","FC Barcelona",120000),
    P("Lauren Hemp","MI",87,92,77,83,87,63,69,"Inglaterra","Manchester City",90000),
    P("Sakina Karchaoui","LI",87,89,76,87,88,79,72,"Francia","PSG",80000),
    P("Rose Lavelle","MCO",87,85,79,84,87,60,65,"Estados Unidos","Gotham FC",65000),
    P("Viktor Gyökeres","DC",86,81,87,72,78,44,87,"Suecia","Arsenal",65000),
    P("Alessandro Bastoni","DFC",86,74,47,76,78,86,82,"Italia","Inter",40000),
    P("Pau Cubarsí","DFC",86,78,44,69,77,85,81,"España","FC Barcelona",48000),
    P("Martin Ødegaard","MC",86,65,78,88,87,66,63,"Noruega","Arsenal",30000),
    P("Enzo Fernández","MC",86,68,78,86,83,74,76,"Argentina","Chelsea",26000),
    P("Dominik Szoboszlai","MCO",86,82,83,86,84,74,77,"Hungría","Liverpool",52000),
    P("Florian Wirtz","MCO",86,77,79,86,88,54,61,"Alemania","Liverpool",55000),
    P("Rayan Cherki","ED",86,74,79,85,91,41,67,"Francia","Manchester City",55000),
    P("Frenkie de Jong","MC",86,77,70,85,84,77,77,"Países Bajos","FC Barcelona",42000),
    P("Bruno Guimarães","MC",86,59,75,85,84,80,80,"Brasil","Newcastle",25000),
    P("Federico Dimarco","LI",86,81,78,85,81,80,74,"Italia","Inter",40000),
    P("Chloe Kelly","MD",86,89,85,85,84,43,69,"Inglaterra","Arsenal",55000),
    P("Georgia Stanway","MCD",86,82,79,80,86,78,78,"Inglaterra","Bayern München",42000),
    P("Désiré Doué","ED",86,83,81,79,90,55,80,"Francia","PSG",90000),
    P("Bradley Barcola","EI",85,92,76,78,84,39,67,"Francia","PSG",45000),
    P("Linda Caicedo","EI",85,93,75,78,89,37,68,"Colombia","Real Madrid",50000),
    P("Joško Gvardiol","DFC",85,78,70,76,77,85,82,"Croacia","Manchester City",40000),
    P("Kevin De Bruyne","MCO",85,59,82,89,84,66,67,"Bélgica","Napoli",22000),
    P("Luka Modrić","MC",85,65,75,87,86,73,59,"Croacia","AC Milan",18000),
    P("Hakan Çalhanoğlu","MCD",85,68,81,85,82,81,68,"Turquía","Inter",18000),
    P("Paulo Dybala","MCO",85,77,84,85,86,42,62,"Argentina","Roma",26000),
    P("Cole Palmer","MCO",85,75,83,85,85,50,64,"Inglaterra","Chelsea",35000),
    P("Nico Williams","EI",84,93,77,79,86,37,67,"España","Athletic Club",28000),
    P("Antoine Griezmann","DC",84,72,85,85,87,59,72,"Francia","Atlético de Madrid",18000),
    P("Éder Militão","DFC",84,79,54,71,72,85,82,"Brasil","Real Madrid",25000),
    P("Bernardo Silva","MC",84,50,77,84,87,71,65,"Portugal","Manchester City",10000),
    P("João Cancelo","LI",83,84,72,84,85,77,72,"Portugal","Al Hilal",18000),
    P("Arda Güler","MD",83,77,79,85,84,55,57,"Turquía","Real Madrid",17000),
    P("Denzel Dumfries","LD",83,82,70,74,79,78,87,"Países Bajos","Inter",14000),
    P("Ibañez","DFC",83,87,48,58,69,83,86,"Brasil","Al Ahli",22000),
    P("Rafael Leão","EI",83,93,79,79,83,30,73,"Portugal","AC Milan",35000),
    P("Karim Adeyemi","MD",82,95,80,72,82,36,69,"Alemania","Borussia Dortmund",35000),
    P("Moussa Diaby","MD",82,94,69,76,85,44,59,"Francia","Al Ittihad",18000),
    P("James Maddison","MC",82,65,81,86,84,57,53,"Inglaterra","Tottenham",7000),
    P("Ángel Di María","ED",82,71,80,85,85,43,62,"Argentina","Rosario Central",7000),
    P("Adam Wharton","MC",82,54,63,85,80,77,69,"Inglaterra","Crystal Palace",6500),
    P("Stefan de Vrij","DFC",82,66,42,67,69,85,75,"Países Bajos","Inter",8000),
    P("Jeremie Frimpong","LD",81,94,62,74,82,72,62,"Países Bajos","Liverpool",20000),
    P("Racheal Kundananji","MI",81,94,80,73,82,59,88,"Zambia","Bay FC",22000),
    P("Loïs Openda","DC",80,94,79,69,78,30,75,"Bélgica","RB Leipzig",16000),
    P("Andrei Rațiu","LD",80,94,67,74,81,74,71,"Rumanía","Rayo Vallecano",15000),
    P("Yankuba Minteh","MD",80,93,72,73,84,57,57,"Gambia","Brighton",14000),
    P("Barış Alper Yılmaz","MI",80,93,75,72,80,69,86,"Turquía","Galatasaray",18000),
    P("Joelinton","MC",80,68,72,76,79,82,90,"Brasil","Newcastle",9500),
    P("Anthony Elanga","ED",79,94,70,74,80,39,65,"Suecia","Newcastle",11000),
    P("Daizen Maeda","MI",78,92,77,70,76,64,77,"Japón","Celtic",8500),
    P("Jamie Gittens","MI",77,92,72,66,82,27,55,"Inglaterra","Chelsea",9000),
    P("Jean-Mattéo Bahoya","MI",76,94,67,68,78,46,59,"Francia","Eintracht Frankfurt",7000),
    P("Carlos Forbs","MD",75,92,71,67,75,38,65,"Portugal","Club Brugge",6500),
    P("Gabriel Silva","EI",74,95,70,67,74,29,62,"Brasil","Santa Clara",5000),
    P("Oliver Burke","DC",73,95,70,64,67,41,73,"Escocia","Union Berlin",4500),
    P("Sirlord Conteh","DC",69,95,64,56,70,37,63,"Alemania","Heidenheim",1500)
  ];

  function metaScore(p){
    let s;
    if(["DC","EI","ED","MI","MD"].includes(p.pos)) s=p.pac*.28+p.sho*.24+p.dri*.27+p.pas*.11+p.phy*.07+p.def*.03;
    else if(["MC","MCO","MCD"].includes(p.pos)) s=p.pac*.13+p.sho*.12+p.pas*.24+p.dri*.20+p.def*.17+p.phy*.14;
    else s=p.pac*.20+p.def*.34+p.phy*.22+p.pas*.10+p.dri*.10+p.sho*.04;
    return Math.round(s);
  }
  function slugify(s){return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}
  raw.forEach((p,i)=>{p.id=slugify(p.name);p.meta=metaScore(p);p.rank=i+1;p.tier=p.ovr>=75?"gold":p.ovr>=65?"silver":"bronze";p.target=Math.max(700,Math.round(p.price*(p.meta>=86?.82:.72)/100)*100);});

  const PACKS=[
    {id:"lab",name:"Daily Lab Pack",subtitle:"Gratis · perfecto para estudiar",cost:0,count:6,min:75,featured:true,tag:"FREE",odds:{89:.003,87:.012,85:.04,83:.13,80:.34}},
    {id:"premium",name:"Premium Gold Players",subtitle:"12 jugadores · 3 raros o mejores",cost:7500,count:12,min:75,tag:"12 PLAYERS",odds:{89:.005,87:.018,85:.06,83:.17,80:.42}},
    {id:"80x5",name:"80+ x5",subtitle:"Cinco cartas 80+ para aprender meta",cost:15000,count:5,min:80,tag:"80+",odds:{89:.009,87:.035,85:.12,83:.34,80:1}},
    {id:"84x3",name:"84+ x3",subtitle:"Pocas cartas, mucho potencial de walkout",cost:30000,count:3,min:84,tag:"84+",odds:{89:.03,87:.13,85:.48,84:1}},
    {id:"meta",name:"Meta Scout Pack",subtitle:"Sesgo hacia ritmo y META score alto",cost:18000,count:6,min:79,tag:"META",metaBias:true,odds:{89:.008,87:.03,85:.10,83:.28,80:.7}},
    {id:"elite",name:"Elite 85+ x10",subtitle:"Modo fantasía para estudiar cartas top",cost:75000,count:10,min:85,tag:"85+ x10",odds:{90:.035,89:.10,88:.24,87:.5,85:1}}
  ];

  const SQUAD_SLOTS=[
    {id:"LW",label:"EI",accept:["EI","MI"],x:18,y:15},{id:"ST",label:"DC",accept:["DC"],x:50,y:10},{id:"RW",label:"ED",accept:["ED","MD"],x:82,y:15},
    {id:"LCM",label:"MC",accept:["MC","MCO","MCD"],x:27,y:41},{id:"CM",label:"MC",accept:["MC","MCO","MCD"],x:50,y:49},{id:"RCM",label:"MC",accept:["MC","MCO","MCD"],x:73,y:41},
    {id:"LB",label:"LI",accept:["LI"],x:13,y:72},{id:"LCB",label:"DFC",accept:["DFC"],x:37,y:67},{id:"RCB",label:"DFC",accept:["DFC"],x:63,y:67},{id:"RB",label:"LD",accept:["LD"],x:87,y:72},
    {id:"GK",label:"POR",accept:["POR"],x:50,y:88}
  ];

  // Curated launch sample. Extend PLAYERS freely: UI, packs, Draft, SBC and Market Lab are data-driven.
  window.PACKVERSE_DATA={PLAYERS:raw,PACKS,SQUAD_SLOTS};
})();
