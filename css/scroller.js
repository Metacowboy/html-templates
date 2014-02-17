<!-- 
     Template for HTML based graphics in CasparCG Server with Berkelium

     This template was created for 1920x1090
	 For other resolutions please see the notes below
	 
	 Contrary to the reccomendations for running Flash based graphics
	 turning on 'ClearType' will result in better font-aliasing for
	 HTML based templates.
-->
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title></title>
		<style>
			* {
				-webkit-box-sizing: border-box;
				Box-Sizing:border-box;							/* This sets all elements to be the actual set dimensions, disregarding padding and borders */
				-webkit-backface-visibility: hidden;			/* Hide the backface of elements - usuefull for 3d effects */
				-webkit-transition: translate3d(0,0,0);			/* Turns on hardware acceleration - not known to be of benefit in CCG, but won't hurt */
			}
			HTML, BODY {
				Width:720px;  									 /* Set to your channel's resolution */
				Height:576px;									 /* Set to your channel's resolution */
				Margin:0;										 /* Use all available space */
				Padding:0;										 /* Use all available space */
				Background:transparent;							 /* The HTML consumer actually makes your background transparent by default, unless a color or image is specified - but this might be usefull when debugging in browsers */
				Overflow:hidden;								 /* Hide any overflowing elements - to disable scollbars */
				-webkit-font-smoothing:antialiased !important;	 /* Set aliasing of fonts - possible options: none, antialiased,  subpixel-antialiased */
			}

			BODY {
				Font-Family: Calibri,Arial;
						Color: #FFF;
			}
					
			/* These are action safe grids - positions are approximate to EBU R95-2008 */
				#action-safe, #graphics-safe {
				Display:visible;							 	 /* Change none to visible to overlay action and graphics safe grids */
				Position:fixed;
				Top:0; Left:0; Bottom:0; Right:0;
				Opacity:0.5;
			}
			#action-safe {
				Border:2px solid green;
				Margin:3.7%;
				Margin-Top:2%;Margin-Bottom:2%;
				Z-Index:99999;
			}
			#graphics-safe {
				Border:2px solid red;
				Margin:10%;
				Margin-Top:3.1%; Margin-Bottom:3.1%;
				Z-Index:99998;
			}
			
			/* These styles are for the demo */
			#caspar-logo {
				Height: 90%;
				Margin: auto;
				Position: absolute;
				Top: 10%; Left: 0; Bottom: 0; Right: 0;
				Text-Align:center;
			}
			#caspar-logo IMG {
				Height: 25%;
				Width: 25%;
				-webkit-animation: cssAnimation 2s infinite linear;
			}
			@-webkit-keyframes cssAnimation {
				0% { -webkit-transform: rotate(0deg) scale(0.90) translate(0px); }
				50% { -webkit-transform: rotate(0deg) scale(1) translate(0px); }
				100% { -webkit-transform: rotate(0deg) scale(0.90) translate(0px); }
			}
			.marquee {
				Width: 100%;
				Height: 50px;
				Overflow: hidden;
				Position: relative;
			}
			.marquee p {
				Font-Size:40px;
				Position: absolute;
				Width: 100%;
				Height: 100%;
				Margin: 0;
				Text-Align: center;
				Text-Shadow: 1px 1px 0px #000000;
				-webkit-transform:translateX(100%);
			}
			.marquee p:nth-child(1) {
				-webkit-animation: left-one 20s ease infinite;
			}
			.marquee p:nth-child(2) {
				-webkit-animation: left-two 20s ease infinite;
			}
			@-webkit-keyframes left-one {
				0% {
					-webkit-transform:translateX(100%);
				}
				10% {
					-webkit-transform:translateX(0);
				}
				40% {
					-webkit-transform:translateX(0);
				}
				50% {
					-webkit-transform:translateX(-100%);
				}
				100%{
					-webkit-transform:translateX(-100%);
				}
			}
			@-webkit-keyframes left-two {
				0% {
					-webkit-transform:translateX(100%);
				}
				50% {
					-webkit-transform:translateX(100%);
				}
				60% {
					-webkit-transform:translateX(0);		
				}
				90% {
					-webkit-transform:translateX(0);		
				}
				100%{
					-webkit-transform:translateX(-100%);
				}
			}
			.scroller {
				Width: 100%;
				Height: 50px;
				Overflow: hidden;
				Position: absolute;
				Top: 80%;
			}
			.scroller p {
				Font-Size:40px;
				Position: absolute;
				Width: 100%;
				Height: 100%;
				Margin: 0;
				Text-Align: left;
				Text-Shadow: 1px 1px 0px #000000;
				-webkit-transform:translateX(100%);
			}
			.scroller p:nth-child(1) {
				-webkit-animation: moveLeft 10s linear infinite;
			}
			.scroller p:nth-child(2) {
				-webkit-animation: moveLeft 10s 5s linear infinite;
			}
			@-webkit-keyframes moveLeft {
				0% {
					-webkit-transform:translateX(100%);
				}
				50% {
					-webkit-transform:translateX(0%);
				}
				100%{
					-webkit-transform:translateX(-100%);
				}
			}
			#ruler { 
				visibility: hidden;
				white-space: nowrap;
				Font-Size:40px;
				Margin: 0;
				Text-Align: center;
				Text-Shadow: 1px 1px 0px #000000;
			}
			#rulerObj {
				white-space: nowrap;
				Font-Size:40px;
				Margin: 0;
				Text-Align: center;
				Text-Shadow: 1px 1px 0px #000000;
			}
		</style>		
		<script type="text/javascript">	
			/* global vars */
			var scrollerText = new Array('');
			var scrollerIndex = 0;
			var width = 720;
			
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
			
			function setScrollerText(text) {
				s=0; e=0; p=0;
				newPages = [];
				rulerObj = document.getElementById('ruler');
				while(e < text.length) {
					rulerObj.innerHTML = escapeHtml(text.substr(s,e));
					while(rulerObj.offsetWidth < width && e < text.length) {
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
			
			function escapeHtml(unsafe) {
				return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
			}
		
			function play() {
				/*document.getElementById('logo').style.webkitAnimationPlayState='running';
				document.getElementById('text1').style.webkitAnimationPlayState='running';
				document.getElementById('text2').style.webkitAnimationPlayState='running';*/
				next();
				
				document.getElementById('p1').style.webkitAnimationPlayState='running';
				document.getElementById('p2').style.webkitAnimationPlayState='running';
				
				document.getElementById('p1').addEventListener('webkitAnimationIteration',scrollNext,false);
				document.getElementById('p2').addEventListener('webkitAnimationIteration',scrollNext,false);
				
				setScrollerText('Das ist ein super einfacher HTML5-Scroller für CasparCG 2.0.7Beta!');
			}
			
			function pause() {
				document.getElementById('logo').style.webkitAnimationPlayState='paused';
				document.getElementById('text1').style.webkitAnimationPlayState='paused';
				document.getElementById('text2').style.webkitAnimationPlayState='paused';
				document.getElementById('p1').style.webkitAnimationPlayState='paused';
				document.getElementById('p2').style.webkitAnimationPlayState='paused';
			}
			
			function stop() {
				document.getElementById('content').style.display='none';
			}
			
			function next() {
				document.getElementById('logo').style.webkitAnimationIterationCount=1;
				document.getElementById('text1').style.webkitAnimationIterationCount=1;
				document.getElementById('text2').style.webkitAnimationIterationCount=1;
			}
		
			// führt funktionen über ACMP aus
			function invoke(str) {
				eval(str);
			}
			
			// call 1-1 invoke "setText('key','value');"
			function setText(key, value) {
				document.getElementById(key).innerHTML=value;
			};
			
			function browseUrl(url) {
				document.getElementById("content").innerHTML='<iframe src=\"' + url + '\" height=100% width=100% background=#ffffff />';
			}
			
			function toggleSafe() {
				if (document.getElementById("graphics-safe").style.display=="none") {
					document.getElementById("graphics-safe").style.display="block";
					document.getElementById("action-safe").style.display="block";
				} else {
					document.getElementById("graphics-safe").style.display="none";
					document.getElementById("action-safe").style.display="none";
				}
			}
		</script>		
    </head>
    <body>
		<span id="ruler"></span>
		<div id="content">
			<!-- SAFE AREA OVERLAY - SEE CSS ABOVE FOR INFORMATION -->
			<div id="action-safe"></div>
			<div id="graphics-safe"></div>
			<!-- //SAFE AREA OVERLAY -->
				
			<div id="caspar-logo">
				<!-- This is a transparent PNG -->
				<img id='logo' src="caspar.png">
				<div class="marquee">
					<p id="text1">WELCOME TO</p>
					<p id="text2">CASPARCG</p>
				</div>
				<p id="rulerObj"> </p>
				<p id="log"></p>
				<div class='scroller'>
					<p id="p1"></p>
					<p id="p2"></p>
				</div>
			</div>
		</div>	
    </body>
</html>