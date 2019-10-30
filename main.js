canvas=document.getElementById("canvas");
ctx=canvas.getContext("2d");

var tex=700;
var tey=700;

var dt=new Date();
var dbg=dt.getTime();
var tbg=10;

var mape={nom:"mape",rebond_bords=true,obstacles=[],objectif=[],pstart=[]};
var persos=[];
var nbp=30;
var nbo=5;
var to=100;
var tp=25;

var bvit=0.0001;
var bcvit=0.01;

var nbgen=1;
var encour=true;
var fini=false;

function collide(r1,r2){
	return rect1.x < rect2.x + rect2.tx && rect1.x + rect1.tx > rect2.x && rect1.y < rect2.y + rect2.ty && rect1.ty + rect1.y > rect2.y;
}

function d_collide(r,rr){
	var sens=[];
	if(r.py < rr.py ) sens.push("up");
	if(r.py+r.ry > rr.py+rr.ty) sens.push("down");
	if(r.px < rr.px ) sens.push("left");
    if(r.px+r.tx > rr.px+rr.tx ) sens.push("right");
	return sens
}

function dist(p,pp){ return Math.sqrt((p.px-pp.px)**2+(p.py-pp.py)**2) }

function gen(){
	mape.objectif={px:Math.random()*(tex-50),py:Math.random()*(tey-50),tx:50,ty:50};
    Mape.pstart=[50+Math.random()*(tex-100),50+Math.random()*(tey-100)];
	mape.obstacles=[];
	for(x=0;x<nbo;x++){
		var xx=Math.random()*tex;
		var yy=Math.random()*tey
		while(collide({px:xx,py:yy,tx:to,ty:to},mape.objectif) && collide({px:xx,py:yy,tx:to,ty:to},{px:mape.pstart[0]-50,py:mape.pstart-50,tx:100,ty:100}){
			var xx=Math.random()*tex;
		    var yy=Math.random()*tey;
		}
		mape.obstacles.push({px:xx,py:yy,tx:to,ty:to});
	}
	for( x=0; x<nbp ; x++){
		var vx=(-1000.0+Math.random()*2000.0)/100.0;
		var vy=(-1000.0+Math.random()*2000.0)/100.0;
		persos.push({px:mape.pstart[0],py:mape pstart[1],tx:tp,ty:tp,vitx:vx,vity:vy,bvitx:vx,bvity:vy})
	}
}


function ev(){
	for( x=0; x<nbp ; x++){
		var vx=(-1000.0+Math.random()*2000.0)/100.0;
		var vy=(-1000.0+Math.random()*2000.0)/100.0;
		persos.push({px:mape.pstart[0],py:mape pstart[1],tx:tp,ty:tp,vitx:vx,vity:vy,bvitx:vx,bvity:vy})
	}
	nbgen+=1;
}

function aff(){
	ctx.fillStyle="rgb(255,255,255)";
	ctx.fillRect(0,0,tex,tey);
	ctx.fillStyle="rg (0,0,255)";
	for( p of persos ){
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
				if("up" in sens || "down" in sens){
                    p.vity=-p.vity;
                    p.vity=baisseVit(p.vity,bcvit);
                    if("up" in sens) p.py=o.py-p.ty-1;
                    if("down" in sens) p.py=o.py+o.ty+1;
                }
				if("left" in sens || "right" in sens){
					p.vitx=baisseVit(p.vitx,bvit);
                    p.vitx=-p.vitx;
                    if("left" in sens) p.px=o.px-p.tx-1;
                    if("right" in sens) p.px=o.px+o.tx+1;
                }
			}
			if(collide(p,mape.objectif)){
				fini=true;
			}
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
			ps={}
			for(p of persos){
				if(p.vitx==0 && p.vity==0){
					ps[ dist(p,mape.objectif) ]=[p.bvitx,p.bvity];
				}
			}
			if(ps.length==persos.length){
				setTimeout( ev , 1000 );
			}
		}
		if(encour) window.requestAnimationFrame(boucle);
	}
	window.requestAnimationFrame(boucle);
}

main();
