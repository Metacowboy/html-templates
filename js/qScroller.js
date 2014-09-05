/*
This is the js code base for the scroll template by sublan.tv.
For a usage description see the scroller.html

In this file, you can only change the animation duration. 
This musst be a even number and is in seconds.
*/

/* USER Variables. Change the visual appearance in here */
var duration = 14; // keep this value even (duration mod 2 = 0)
var font = 'Calibri, Arial'; // The text font
var fontSize = '40px'; // the font size 
var color = '#FFFFFF'; // the font color
var scrollerHeight = '100px'; // the height of the scroller box. Important for Page Animations with Top/Bottom direction

/* global vars - please don't edit here! */
var messageQueue; // = new MessageQueue();
var active = false;
var animation = 'ScrollLeft';
var isScroll = /^Scroll/;
var rulerObj; // = document.getElementById('ruler');
var p1; // = document.getElementById('p1');
var p2; // = document.getElementById('p2');
var scroller; // = document.getElementById('scroller');
var log;

var testText = 'This is the test scroll for the brand new scroller template by sublan.tv - We hope you enjoy this template and find it to be usefull.';
var testPages = ['1. Wow - This is a short test page', '2. But this one is realy, realy looooooonnnnnnngggggggggg. Let\'s see whether it fits onto the page or, if not, the fittinng algo works correctly and splitts it over multiple pages instead of let it overlap or run out of the screen.','3. This one is short again. Yeah ;-)'];

/* 
EVENT HANDLER 
=============
*/
function scrollStopped() {
	// reset animation
	event.target.style.webkitAnimationPlayState='paused';
	event.target.style.webkitAnimationDelay=0; // the delay is only needed at the first start of an animation!
	if (active) {
		// play again
		playAnimation(event.target);
	} else if (messageQueue.currentMessage() && messageQueue.currentMessage().hasNext()) {
		// The message is not played complete, we have to complete it
		playAnimation(event.target);
	}
}

function init() {
	// Init global objects 
	//document.getElementById('log').innerHTML='init()';
	
	messageQueue = new MessageQueue();
	rulerObj = document.getElementById('ruler');
	p1 = document.getElementById('p1');
	p2 = document.getElementById('p2');
	scroller = document.getElementById('scroller');
	log = document.getElementById('log');
	
	// Init look
	scroller.style.fontFamily=font;
	scroller.style.fontSize=fontSize;
	scroller.style.color=color;
	scroller.style.height=scrollerHeight;
	scroller.style.lineHeight=scroller.offsetHeight+'px';
	rulerObj.style.fontFamily=font;
	rulerObj.style.fontSize=fontSize;
	rulerObj.style.color=color;
	rulerObj.style.height=scrollerHeight;
	rulerObj.style.lineHeight=rulerObj.offsetHeight+'px';
	
	//testScroll();
	//testPage();
}

/* 
SETTER 
======
*/
function setNextPageText(obj) {
	if (!messageQueue.isEmpty()) {
		var page = messageQueue.nextPage();
		rulerObj.innerHTML=page.text;
		obj.innerHTML=page.text;
		
		// Adjust spacing to make sure the text fills the whole page. Not for the last page and only with Scroll* Animations
		obj.style.letterSpacing = 'normal';
		obj.style.wordSpacing = 'normal';
		rulerObj.style.letterSpacing = 'normal';
		rulerObj.style.wordSpacing = 'normal';

		if ( isScroll.test(animation) && !page.noStretch) { 
			var diff = window.innerWidth - rulerObj.offsetWidth;
			
			// if there are more chars than missing pixels, we can use letter-spacing
			if (diff > page.text.length-1) {
				rulerObj.style.letterSpacing=Math.ceil(diff/(page.text.length-1)) + 'px';
				obj.style.letterSpacing=Math.ceil(diff/(page.text.length-1)) + 'px';
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
	}
}

// set the pages to show without check fittings and overwrite whats on now
function setPages(pages) {
	messageQueue.clear(true);
	messages = [];
	if (pages !== null) {
		for (page in pages) {
			messages.push(new Message(new Page(escapeHtml(pages[page]), true)));
		}
	}
	messageQueue.update(messages,true);
} 

// set the pages to show and check fitting and overwrite whats on now
function setFitted(pages) {
	messageQueue.clear(true);
	messages = [];
	if (pages !== null) {
		for (entry in pages) {
			messages.push(fitTextToPages(pages[entry]));
		}
	}
	messageQueue.update(messages,true);
}

// set the text to show and overwrite whats on now
function setScrollText(text) {
	messageQueue.clear(true);
	// fit the text to as many pages as needed
	messageQueue.addMessage(fitTextToPages(text));
}

// add the pages to that which are on that are ON without check fittings
function addPages(pages) {
	if (pages !== null) {
		for (page in pages) {
			messageQueue.addMessage(new Message(new Page(escapeHtml(pages[page]), true)));
		}
	}
} 

// add the pages to that which are ON and check fitting
function addFitted(pages) {
	if (pages !== null) {
		for (entry in pages) {
			messageQueue.addMessage(fitTextToPages(pages[entry]));
		}
	}
}

// add the text to the one that is ON
function addScrollText(text) {
	// fit the text to as many pages as needed
	messageQueue.addMessage(fitTextToPages(text));
}

// update the pages without check fitting so that the current cycle ends and this will show
function updatePages(pages) {
	messages = [];
	if (pages !== null) {
		for (page in pages) {
			messages.push(new Message(new Page(escapeHtml(pages[page]), true)));
		}
	}
	messageQueue.update(messages);
} 

// update the pages and check fitting so that the current cycle ends and this will show
function updateFitted(pages) {
	messages = [];
	if (pages !== null) {
		for (entry in pages) {
			messages.push(fitTextToPages(pages[entry]));
		}
	}
	messageQueue.update(messages);
}

// update the text so that the current cycle ends and this will show
function updateScrollText(text) {
	// fit the text to as many pages as needed
	messageQueue.update([fitTextToPages(text)]);
}

// spreads the given text over a number of pages needed to show the text on screen and 
// return a new message.
function fitTextToPages(text) {
	if (text && text.length > 0) {
		var start = 0;
		var end = 0;
		var lastWidth = 0;
		var newPages = [];
		
		while(end < text.length) {
			rulerObj.innerHTML = escapeHtml(text.substring(start,end));
			lastWidth = rulerObj.offsetWidth;
			while( lastWidth < p1.offsetWidth && end < text.length) {
				rulerObj.innerHTML = escapeHtml(text.substring(start,++end));
				lastWidth = rulerObj.offsetWidth;
			}
			// if we're not at the end, we need to take the one that fits
			if (end < text.length) {
				end--;
			}
			newPages.push(new Page(escapeHtml(text.substring(start,end))));
			start=end;
		}
		if (newPages.length > 0) {
			// set noStretch at the last page as it can be much smaller and should not be stretched.
			newPages[newPages.length-1].noStretch = true;
			return new Message(newPages);
		}
	}
	return new Message();
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
	if (active) {
		stop();
		animation=anim;
		play();
	} else {
		animation=anim;
	}
}

function setFontSize(size) {
	reset();
	fontSize = size;
	setLook();
}

function setFont(name) {
	reset();
	font=name;
	setLook();
}

function setColor(textColor) {
	color=textColor;
	setLook();
}

function setScrollerHeight(sSize) {
	scrollerHeight = sSize;
	setLook();
}

function setDuration(dur) {
	duration = dur;
}

function setLook() {
	// customize the look
	scroller.style.fontFamily=font;
	scroller.style.fontSize=fontSize;
	scroller.style.color=color;
	scroller.style.height=scrollerHeight;
	scroller.style.lineHeight=scroller.offsetHeight+'px';
	rulerObj.style.fontFamily=font;
	rulerObj.style.fontSize=fontSize;
	rulerObj.style.color=color;
	rulerObj.style.height=scrollerHeight;
	rulerObj.style.lineHeight=rulerObj.offsetHeight+'px';
}

function reset() {
	stop();
	messageQueue.clear(true);
	p1.innerHTML='';
	p2.innerHTML='';
	log.innerHTML='';
}

/*
Actions
=======
*/
function playAnimation(obj) {
	obj.offsetWidth = obj.offsetWidth;
	setNextPageText(obj);
	obj.addEventListener('webkitAnimationEnd',scrollStopped,false);
	obj.style.webkitAnimationIterationCount=1;
	setObjectAnimation(animation,obj);
	obj.style.webkitAnimationPlayState='running';
	obj.style.visibility='visible';
	//$(obj).show();
}

function togglePause() {
	if (p1.style.webkitAnimationPlayState=='paused') {
		p1.style.webkitAnimationPlayState='running';
		p2.style.webkitAnimationPlayState='running';
	} else {
		p1.style.webkitAnimationPlayState='paused';
		p2.style.webkitAnimationPlayState='paused';	
	}
}

/* 
CasparCG standard functions 
===========================
*/
function play() {
	stop();
	
	// This line is just to make sure the animation really starts if it has been played by changing the object
	p1.offsetWidth = p1.offsetWidth;
	p2.offsetWidth = p2.offsetWidth;
	
	//$('#totalbg').show();
	//$('#textbg').fadeIn();
	//$('#textview').fadeIn();

	p1.offsetWidth = p1.offsetWidth;
	p2.offsetWidth = p2.offsetWidth;
	p1.style.webkitAnimationDuration=duration+'s';
	p2.style.webkitAnimationDuration=duration+'s';
	p2.style.webkitAnimationDelay=duration/2 + 's';
	
	active=true;

	playAnimation(p1);
	playAnimation(p2);
}

function stop() {
	active=false;
	
	// reset animation
	//$('#totalbg').fadeOut();
	//$('#textbg').fadeOut();
	//$('#textview').fadeOut();
	document.getElementById('p1').style.webkitAnimationIterationCount=0;
	document.getElementById('p1').webkitAnimationPlayState='paused';
	document.getElementById('p1').style.visibility='hidden';
	//$('#p1').fadeOut();
	document.getElementById('p1').style.webkitAnimationName='';
	document.getElementById('p2').style.webkitAnimationIterationCount=0;
	document.getElementById('p2').webkitAnimationPlayState='paused';
	document.getElementById('p2').style.visibility='hidden';
	//$('#p2').fadeOut();
	document.getElementById('p2').style.webkitAnimationName='';
	
}

function next() {
	active=false;
}

function update(str) {
	updateScrollText(str);
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
	//setPages(testPages);
	setFitted(testPages);
	setAnimation('TopInBottomOut');
	play();
}

function escapeHtml(unsafe) {
	return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}