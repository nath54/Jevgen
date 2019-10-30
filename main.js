canvas=document.getElementById("canvas");
ctx=canvas.getContext("2d");

var tex=parseInt(canvas.width);
var tey=parseInt(canvas.height);

var dt=new Date();
var dbg=dt.getTime();
var tbg=10;

var mape={nom:"mape",rebond_bords:true,obstacles:[],objectif:[],pstart:[]};
var persos=[];
var nbp=30;
var nbo=40;
var to=50;
var tp=25;

var bvit=0.1;
var bcvit=1;

var nbgen=1;
var encour=true;
var fini=false;

var ps={};

function collide(rect1,rect2){
	return rect1.px < rect2.px + rect2.tx && rect1.px + rect1.tx > rect2.px && rect1.py < rect2.py + rect2.ty && rect1.ty + rect1.py > rect2.py;
}

function d_collide(r,rr){
	var sens=[];
	if(r.py < rr.py && r.py+r.ty>rr.py) sens.push("up");
	if(r.py+r.ty > rr.py+rr.ty && r.py < rr.py+rr.ty) sens.push("down");
	if(r.px < rr.px && r.px+r.tx>rr.px) sens.push("left");
    if(r.px+r.tx > rr.px+rr.tx && r.px < rr.px+rr.tx ) sens.push("right");
	return sens
}

function dist(p,pp){ return Math.sqrt((p.px-pp.px)**2+(p.py-pp.py)**2) }

function gen(){
	mape.objectif={px:Math.random()*(tex-50),py:Math.random()*(tey-50),tx:50,ty:50};
    mape.pstart=[50+Math.random()*(tex-100),50+Math.random()*(tey-100)];
	mape.obstacles=[];
	for(x=0;x<nbo;x++){
		var xx=Math.random()*tex;
		var yy=Math.random()*tey
		while( collide( {px:xx,py:yy,tx:to,ty:to} , mape.objectif ) && collide( {px:xx,py:yy,tx:to,ty:to} , {px:mape.pstart[0]-50,py:mape.pstart-50,tx:100,ty:100} )){
			var xx=Math.random()*tex;
		    var yy=Math.random()*tey;
		}
		mape.obstacles.push({px:xx,py:yy,tx:to,ty:to});
	}
	for( w=0; w<nbp ; w++){
		var vx=(-1000.0+Math.random()*2000.0)/100.0;
		var vy=(-1000.0+Math.random()*2000.0)/100.0;
		persos.push( { px : mape.pstart[0] , py : mape.pstart[1] , tx:tp , ty:tp , vitx:vx , vity:vy , bvitx:vx , bvity:vy , ap:[] , cl:[0,0,255] } );
	}
}


function ev(){
    var vv=Object.keys(ps).sort();
    var valeurs=[];
    for(x=0;x<vv.length*5/100;x++){
        valeurs.push(ps[vv[x]]);
    }
    persos=[];
	for( w=0; w<nbp ; w++){
	    try{
    	    var f=parseInt(Math.random()*valeurs.length);
	        vvv=valeurs[f];
	    	var vx=vvv[0]+(-100.0+Math.random()*200)/100.0;
	    	var vy=vvv[1]+(-100.0+Math.random()*200)/100.0;
	    }
	    catch{
	        console.log("ERROR");
	        var vx=(-1000.0+Math.random()*2000.0)/100.0;
    		var vy=(-1000.0+Math.random()*2000.0)/100.0;
	    }
		persos.push({px:mape.pstart[0],py:mape.pstart[1],tx:tp,ty:tp,vitx:vx,vity:vy,bvitx:vx,bvity:vy,ap:[],cl:[0,0,255]})
	}
	nbgen+=1;
}

function trier(){
    var dd={};
    for(p of persos){
        dd[dist(p,mape.objectif)]=p;
    }
    var ddd=Object.keys(dd).sort();
    var n=0;
    var nn=ddd.length;
    for( d of ddd ){
    
    }
}

function aff(){
	ctx.fillStyle="rgb(255,255,255)";
	ctx.fillRect(0,0,tex,tey);
	for( p of persos ){
	    ctx.fillStyle="rgb("+p.cl[0]+","+p.cl[1]+","+p.cl[2]+")";
    	ctx.strokeStyle="rgb("+p.cl[0]+","+p.cl[1]+","+p.cl[2]+")";
	    if( p.ap.length > 1){
            ctx.beginPath();
            ctx.moveTo(p.ap[0][0],p.ap[0][1]);
    	    for( a of p.ap ){
	            ctx.lineTo(a[0],a[1]);
	        }
	        ctx.stroke();
	    }
		ctx.fillRect(p.px,p.py,p.tx,p.ty);
	}
	ctx.fillStyle="rgb(30,30,30)";
	for(o of mape.obstacles){
		ctx.fillRect(o.px,o.py,o.tx,o.ty);
	}
	ctx.fillStyle="rgb(0,255,0)";
	ctx.fillRect(mape.objectif.px,mape.objectif.py,mape.objectif.tx,mape.objectif.ty);
}

function baisseVit(v,b){
	if(v>0){
		v-=b;
		if(v<0){
			v=0
		}
	}
	else{
		v+=b;
		if(v>0){
			v=0;
		}
	}
	return v
}

function update(){
	for( p of persos ){
		p.vitx=baisseVit(p.vitx,bvit);
		p.vity=baisseVit(p.vity,bvit);
		p.px+=p.vitx;
		p.py+=p.vity;
		for( o of mape.obstacles ){
			if(collide(p,o)){
				sens=d_collide(p,o);
				if(sens.includes("up") || sens.includes("down")){
                    p.vity=-p.vity;
                    p.vity=baisseVit(p.vity,bcvit);
                    if("up" in sens) p.py=o.py-p.ty-1;
                    if("down" in sens) p.py=o.py+o.ty+1;
                }
				if(sens.includes("left") || sens.includes("right")){
					p.vitx=baisseVit(p.vitx,bvit);
                    p.vitx=-p.vitx;
                    if("left" in sens) p.px=o.px-p.tx-1;
                    if("right" in sens) p.px=o.px+o.tx+1;
                }
			}
		}
		if(mape.rebond_bords){
			 if(p.px<0){
			    p.px=0;
			    p.vitx=-p.vitx;
			    p.vitx=baisseVit(p.vitx,bvit);
			 }
			 if(p.px+p.tx>tex){
			    p.px=tex-p.tx;
			    p.vitx=-p.vitx;
			    p.vitx=baisseVit(p.vitx,bvit);
			 }
			 if(p.py<0){
			    p.py=0;
			    p.vity=-p.vity;
			    p.vity=baisseVit(p.vity,bvit);
			 }
			 if(p.py+p.ty>tey){
			    p.py=tey-p.ty;
			    p.vity=-p.vity;
			    p.vity=baisseVit(p.vity,bvit);
			 }
		}
		if(collide(p,mape.objectif)){
			fini=true;
		}
	}
}

function main(){
	gen();
	function boucle(){
		var dt=new Date();
		if(dt.getTime()-dbg>=tbg){
			dbg=dt.getTime();
			aff();
			update();
			ps={};
			for(p of persos){
			    p.ap.push([p.px+p.tx/2,p.py+p.ty/2]);
				if(p.vitx==0 && p.vity==0){
					ps[dist(p,mape.objectif)]=[p.bvitx,p.bvity];
				}
			}
			if(Object.keys(ps).length==persos.length){
			    if(fini) encour=false;
				else ev();
			}
			document.getElementById("nbgen").innerHTML="Nbgen = "+nbgen;
			document.getElementById("encour").innerHTML="Encour = "+encour;
		}
		if(encour) window.requestAnimationFrame(boucle);
		else document.getElementById("textefin").innerHTML="Fini en "+nbgen+" génération";
	}
	window.requestAnimationFrame(boucle);
}

main();
