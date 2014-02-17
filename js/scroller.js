
/* global vars */
var scrollerText = new Array('Das ist ein Test ','für den HTML5 Scroller.');
var scrollerIndex = 0;
var active=false;
var duration = 10
var animation = 'ScrollLeft';
var animations = 'ScrollLeft RightInRightOut RightInLeftOut';

/* EVENT HANDLER */
function setNextPageText(obj) {
	document.getElementById('log').innerHTML='setNextPageText()';

	if (scrollerText.length > 0) {
		if (scrollerIndex > scrollerText.length-1) {
			scrollerIndex = 0;
		}
		// replace leading spaces with margin to keep the layout correct
		// TODO: Change for left/right scrolling!
		p=0;
		while(p < scrollerText[scrollerIndex].length && scrollerText[scrollerIndex].substring(p,1) == ' ') {p++;}
		obj.style.marginLeft = (10*p) + 'px';
		obj.innerHTML=unescape(scrollerText[scrollerIndex++]);
	}
}
	
function scrollStopped() {
	document.getElementById('log').innerHTML='scrollStopped()';

	// reset animation
	event.target.style.webkitAnimationPlayState='paused';
	event.target.style.visibility='hidden';
	event.target.style.webkitAnimationName='';
	event.target.style.webkitAnimationIterationCount=0;
	event.target.style.webkitAnimationDelay=0; // the delay is only needed at the first start of an animation!
	if (active) {
		// play again
		playAnimation(event.target);
	} 
}

/* SETTER */
function setPages(pages) {
	document.getElementById('log').innerHTML='setPages()';
	scrollerText = pages;
} 

function setScrollText(text) {
	document.getElementById('log').innerHTML='setScrollText()';

	s=0; e=0; p=0;
	newPages = [];
	rulerObj = document.getElementById('ruler');
	while(e < text.length) {
		rulerObj.innerHTML = escapeHtml(text.substr(s,e));
		while(rulerObj.offsetWidth < window.innerWidth && e < text.length) {
			rulerObj.innerHTML = escapeHtml(text.substr(s,++e));
		}
		newPages[p++] = escapeHtml(text.substr(s,e-1));
		s=e-1;
	}
	if (p === 0) {
		scrollerText = new Array('');
	} else {				
		scrollerText = newPages;
	}
	scrollerIndex = 0;
}

function setObjectAnimation(anim, obj) {
	obj.style.webkitAnimationName=anim;
	switch (anim) {
		case 'ScrollLeft':
			document.getElementById('scroller').style.textAlign='left';
			obj.style.webkitAnimationTimingFunction='linear';
			break;
		case 'ScrollRight':
			document.getElementById('scroller').style.textAlign='right';
			obj.style.webkitAnimationTimingFunction='linear';
			break;
		default:
			document.getElementById('scroller').style.textAlign='center';
			obj.style.webkitAnimationTimingFunction='ease';
	}
}

function setAnimation(anim) {
	document.getElementById('log').innerHTML='setAnimation()';
	animation=anim;
	if (activ) {
		stop();
		play();
	}
}

function playAnimation(obj) {
	document.getElementById('log').innerHTML='playObjectAnimation()';
	
	// This line is just to make sure the animation really starts if it has been played.
	obj.offsetWidth = obj.offsetWidth;
	setNextPageText(obj);
	obj.addEventListener('webkitAnimationEnd',scrollStopped,false);
	obj.style.webkitAnimationIterationCount=1;
	obj.style.visibility='visible';
	setObjectAnimation(animation,obj);
	obj.style.webkitAnimationPlayState='running';
}

/* CasparCG standard functions */
function play() {
	document.getElementById('log').innerHTML='play()';
	stop();
	active=true;
	setNextPageText(document.getElementById('p1'));
	setNextPageText(document.getElementById('p2'));
	// Reset duration and delay of second page
	document.getElementById('p1').style.webkitAnimationDuration=duration;
	document.getElementById('p2').style.webkitAnimationDuration=duration;
	document.getElementById('p2').style.webkitAnimationDelay=duration/2 + 's';
	playAnimation(document.getElementById('p1'));
	playAnimation(document.getElementById('p2'));
}

function togglePause() {
	if (document.getElementById('p1').style.webkitAnimationPlayState=='paused') {
		document.getElementById('p1').style.webkitAnimationPlayState='running';
		document.getElementById('p2').style.webkitAnimationPlayState='running';
	} else {
		document.getElementById('p1').style.webkitAnimationPlayState='paused';
		document.getElementById('p2').style.webkitAnimationPlayState='paused';	
	}
}

function stop() {
	active=false;
	document.getElementById('p1').style.webkitAnimationIterationCount=0;
	document.getElementById('p1').webkitAnimationPlayState='paused';
	document.getElementById('p1').style.visibility='hidden';
	document.getElementById('p1').style.webkitAnimationName='';
	document.getElementById('p2').style.webkitAnimationIterationCount=0;
	document.getElementById('p2').webkitAnimationPlayState='paused';
	document.getElementById('p2').style.visibility='hidden';
	document.getElementById('p2').style.webkitAnimationName='';
}

function next() {
	active=false;
	/* 
    document.getElementById('log').innerHTML='Next. Set IterationCount: ' + animationIteration['p1'];
	document.getElementById('p1').style.webkitAnimationIterationCount=animationIteration['p1']+1;
	document.getElementById('p2').style.webkitAnimationIterationCount=animationIteration['p2']+1;
	*/
}

function update(str) {
	setScrollText(str);
}

function invoke(str) {
	eval(str);
}

/* Util */
function escapeHtml(unsafe) {
	return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}