
/* global vars */
var scrollerText = [''];
var scrollerIndex = 0;
var active = false;
var duration = 10;
var animation = 'ScrollLeft';
var animations = 'ScrollLeft RightInRightOut RightInLeftOut';

var testText = 'CasparCG 2.0.7Beta has a brand new HTML Producer! This is so amazing! And guess what? This is a scroll template for you. Have fun using it! By sublan.tv';
var testPages = ['1: CasparCG 2.0.7Beta has a', '2: brand new HTML Producer!', '3: This is so amazing!', '4: And guess what?', '5: This is a scroll template for you.','6: Have fun using it!','7: By sublan.tv'];

/* EVENT HANDLER */
function setNextPageText(obj) {

	if (scrollerText.length > 0) {
		if (scrollerIndex > scrollerText.length-1) {
			scrollerIndex = 0;
		}
		var rulerObj = document.getElementById('ruler');		
		rulerObj.innerHTML=scrollerText[scrollerIndex];
		obj.innerHTML=scrollerText[scrollerIndex];
		
		// Adjust spacing to make sure the text fills the whole page. Not for the last page and only with Scroll* Animations
		obj.style.letterSpacing = 'normal';
		obj.style.wordSpacing = 'normal';
		rulerObj.style.letterSpacing = 'normal';
		rulerObj.style.wordSpacing = 'normal';
		
		var isScroll = /^Scroll/;
		if ( isScroll.test(animation) && scrollerIndex != scrollerText.length-1) { 
			var diff = window.innerWidth - rulerObj.offsetWidth;
			
			// if there are more chars than missing pixels, we can use letter-spacing
			if (diff > scrollerText[scrollerIndex].length-1) {
				rulerObj.style.letterSpacing=Math.ceil(diff/(scrollerText[scrollerIndex]-1)) + 'px';
				obj.style.letterSpacing=Math.ceil(diff/(scrollerText[scrollerIndex]-1)) + 'px';
				diff = window.innerWidth - rulerObj.offsetWidth;
			
			}
			// for the rest, we try word-spacing
			var spacing = 0;
			while( rulerObj.offsetWidth < window.innerWidth) {
				spacing++;
				rulerObj.style.wordSpacing = spacing + 'px';
			}
			
			// we will use the amount of wordspacing with the smaller error
			var diffOver = Math.abs(window.innerWidth - rulerObj.offsetWidth);
			rulerObj.style.wordSpacing = (spacing - 1) + 'px';
			if (diffOver > (window.innerWidth - rulerObj.offsetWidth)) {
				spacing--;
			}
			if (spacing > 0) {
				obj.style.wordSpacing = spacing + 'px';
				rulerObj.style.wordSpacing = spacing + 'px';
				diff = window.innerWidth - rulerObj.offsetWidth;
			} else {
				obj.style.wordSpacing = 'normal';
				rulerObj.style.wordSpacing = 'normal';
			}
		}
		scrollerIndex++;
	}
}
	
function scrollStopped() {
	//document.getElementById('log').innerHTML='scrollStopped()';

	// reset animation
	event.target.style.webkitAnimationPlayState='paused';
	event.target.style.webkitAnimationDelay=0; // the delay is only needed at the first start of an animation!
	if (active) {
		// play again
		playAnimation(event.target);
	} 
}

/* SETTER */
function setPages(pages) {
	//document.getElementById('log').innerHTML='setPages()';
	if (pages !== null) {
		scrollerText = pages;
	}
} 

function setScrollText(text) {
	//document.getElementById('log').innerHTML='setScrollText('+ text.length +')<br>'+text;
	var start = 0;
	var end = 0;
	var	page = 0;
	var lastWidth = 0;
	var newPages = [];
	var rulerObj = document.getElementById('ruler');

	while(end < text.length) {
		rulerObj.innerHTML = escapeHtml(text.substring(start,end));
		lastWidth = rulerObj.offsetWidth;
		while( lastWidth < window.innerWidth && end < text.length) {
			rulerObj.innerHTML = escapeHtml(text.substring(start,++end));
			lastWidth = rulerObj.offsetWidth;
		}
		
		// if we're not at the end, we need to take the one that fits
		if (end < text.length) {
			end--;
		}
		newPages[page++] = escapeHtml(text.substring(start,end));
		start=end;
	}

	if (page > 0) {	
		scrollerText = newPages;
	} else {
		scrollerText = [''];
	}
	scrollerIndex = 0;
	
}

function setObjectAnimation(anim, obj) {
	obj.style.webkitAnimationName=anim;
	switch (anim) {
		case 'ScrollLeft':
			obj.style.textAlign='left';
			obj.style.webkitAnimationTimingFunction='linear';
			break;
		case 'ScrollRight':
			obj.style.textAlign='right';
			obj.style.webkitAnimationTimingFunction='linear';
			break;
		default:
			obj.style.textAlign='center';
			obj.style.webkitAnimationTimingFunction='ease';
	}
}

function setAnimation(anim) {
	//document.getElementById('log').innerHTML='setAnimation()';
	animation=anim;
	if (active) {
		stop();
		play();
	}
}

function playAnimation(obj) {
	//document.getElementById('log').innerHTML='playObjectAnimation()';
	obj.offsetWidth = document.getElementById('p1').offsetWidth;
	setNextPageText(obj);
	obj.addEventListener('webkitAnimationEnd',scrollStopped,false);
	obj.style.webkitAnimationIterationCount=1;
	setObjectAnimation(animation,obj);
	obj.style.webkitAnimationPlayState='running';
	obj.style.visibility='visible';
}

/* 
CasparCG standard functions 
===========================
*/
function play() {
	//document.getElementById('log').innerHTML='play()';
	stop();
	active=true;
	
	// This line is just to make sure the animation really starts if it has been played by changing the object
	document.getElementById('p1').offsetWidth = document.getElementById('p1').offsetWidth;
	document.getElementById('p2').offsetWidth = document.getElementById('p2').offsetWidth;
	
	// Reset duration and delay of second page
	document.getElementById('p1').style.webkitAnimationDuration=duration+'s';
	document.getElementById('p2').style.webkitAnimationDuration=duration+'s';
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
	// reset animation
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
	// Will stop after finishing the active animation
	// ToDo: Change so that a scroll is ended correct
	active=false;
}

function update(str) {
	//document.getElementById('log').innerHTML='update()';
	setScrollText(str);
}

function invoke(str) {
	eval(str);
}

/* 
Util 
====
*/
function testScroll() {
	stop();
	setScrollText(testText);
	setAnimation('ScrollLeft');
	play();
}

function testPage() {
	stop();
	setPages(testPages);
	setAnimation('TopInBottomOut');
	play();
}

function escapeHtml(unsafe) {
	return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}