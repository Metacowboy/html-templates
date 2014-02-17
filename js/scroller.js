
/* global vars */
var scrollerText = new Array('');
var scrollerIndex = 0;
var animation = 'ScrollLeft';
var animations = 'ScrollLeft RightInRightOut RightInLeftOut';

function scrollNext() {
	if (scrollerText.length > 0) {
		if (scrollerIndex > scrollerText.length-1) {
			scrollerIndex = 0;
		}
		// replace leading spaces with margin to keep the layout correct
		p=0;
		while(p < scrollerText[scrollerIndex].length && scrollerText[scrollerIndex].substring(p,1) == ' ') {p++;}
		event.target.style.marginLeft = (10*p) + 'px';
		event.target.innerHTML=unescape(scrollerText[scrollerIndex++]);
	}
}

function setPages(pages) {
	scrollerText = pages;
} 

function setScrollText(text) {
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
	if (p == 0) {
		scrollerText = new Array('');
	} else {				
		scrollerText = newPages;
	}
	scrollerIndex = 0;
}

function setAnimation(anim) {
	
}

/* CasparCG standard functions */
function play() {
	document.getElementById('p1').style.webkitAnimationPlayState='running';
	document.getElementById('p2').style.webkitAnimationPlayState='running';
	
	document.getElementById('p1').addEventListener('webkitAnimationIteration',scrollNext,false);
	document.getElementById('p2').addEventListener('webkitAnimationIteration',scrollNext,false);
}

function pause() {
	document.getElementById('p1').style.webkitAnimationPlayState='paused';
	document.getElementById('p2').style.webkitAnimationPlayState='paused';
}

function stop() {
	document.getElementById('content').style.display='none';
}

function next() {
	document.getElementById('p1').style.webkitAnimationIterationCount=1;
	document.getElementById('p2').style.webkitAnimationIterationCount=1;
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