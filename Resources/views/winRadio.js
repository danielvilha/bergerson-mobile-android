var win = Titanium.UI.currentWindow;
win.backgroundImage = 'background.png';

var logoView = Titanium.UI.createView({
	width : '95%',
	height : 75,
	top : 25

});

var imageLogo = Titanium.UI.createImageView({
	image : 'logo.png'
});

logoView.add(imageLogo);

win.add(logoView);

//--------------------------------------------LAYER VIEW------------------------------------------------
//------------------------ É ADICIONADO ACTIVEINDICATOR, PLAY/PAUSE E VOLUME ---------------------------
var layerView = Titanium.UI.createView({
	backgroundImage : 'layer.png',
	bottom : 15,
	width : '90%',
	height : '15%',
});

var lessLabel = Titanium.UI.createLabel({
	text : '-',
	color : '#FFFF',
	font : {
		fontSize : 45,
		font : 'Optima-ExtraBlack'
	},
	left : 100
});

var moreLabel = Titanium.UI.createLabel({
	text : '+',
	color : '#FFFF',
	font : {
		fontSize : 25,
		font : 'Optima-ExtraBlack'
	},
	right : 15
});

layerView.add(lessLabel);
layerView.add(moreLabel);
//---------------------------------------ACTIVITY INDICATOR---------------------------------------------
var actInd = Titanium.UI.createActivityIndicator({
	zIndex : 9,
	height : 'auto',
	width : 'auto',
	message : 'Buscando rede...'
});

function indAudio() {
	if (audioPlayer.BUFFERING < 0 && audioPlayer.STATE_WAITING_FOR_DATA) {
		actInd.show();
	} else {
		actInd.hide();
	}
}

var loopIndicator;

win.add(actInd);

//---------------------------------------------PLAUSE---------------------------------------------------
var pauseResumeButton = Titanium.UI.createButton({
	backgroundImage : 'button/but_Play.png',
	enabled : false,
	height : '65%',
	width : '15%',
	left : 15
});

layerView.add(pauseResumeButton);

pauseResumeButton.addEventListener('click', function() {
	if (audioPlayer.paused) {
		pauseResumeButton.backgroundImage = 'button/but_Pause.png';
		audioPlayer.start();
	} else {
		pauseResumeButton.backgroundImage = 'button/but_Play.png';
		audioPlayer.pause();
	}
});

//---------------------------------------------VOLUME---------------------------------------------------
var volumeSlider = Ti.UI.createSlider({
	left : 135,
	right : 40,
	value : 100,
	min : 0,
	max : 100,
	zIndex : 9
});

layerView.add(volumeSlider);

volumeSlider.addEventListener('change', function(e) {
	audioPlayer.volume = e.value / 100
});

win.add(layerView);
//------------------------------------------FIM DO LAYER-------------------------------------------------
//-------------------------------------------------------------------------------------------------------

//--------------------------------------------PLAYER----------------------------------------------------
var button = ['LOUNGE', 'ROCK', 'MPB', 'POP'];
var startStopButton = [];
var cont = 20;

var urlStream = ['http://200.195.168.12:9191', 'http://200.195.168.12:9292', 'http://200.195.168.12:9393', 'http://200.195.168.12:9494'];

var audioPlayer = Ti.Media.createAudioPlayer({
	url : urlStream[0],
	allowBackground : true
});

for (var i = 0, s = button.length; i < s; i++) {
	var objectButton = Ti.UI.createButton({
		title : button[i],
		backgroundImage : 'button/but_RadioOff.png',
		backgroundFocusedImage : 'button/but_RadioOn.png',
		// selectedColor : '#EDDA74',
		height : '14%',
		center : '50%',
		top : cont + '%',
		font : {
			fontSize : '22%',
			fontFamily : 'timesnewroman'
		},
		color : '#EDDA74',
		width : '85%'
	});

	cont += 15;
	win.add(objectButton);
	startStopButton.push(objectButton);
	startStopButton[i].urlStream = urlStream[i];
	startStopButton[i].addEventListener('click', function(e) {
		if (Ti.Network.online == false) {
			alert('Está aplicação necessita de uma conexão Internet para funcionar: Favor verefique sua conexão.');
		} else {
			for (var i = 0, s = startStopButton.length; i < s; i++) {
				startStopButton[i].backgroundImage = 'button/but_RadioOff.png';
			}
			if (audioPlayer.playing || audioPlayer.paused) {
				if (audioPlayer.url == e.source.urlStream) {
					clearInterval(loopIndicator);
					audioPlayer.release();
					e.source.backgroundImage = 'button/but_RadioOff.png';
					pauseResumeButton.backgroundImage = 'button/but_Play.png';
					pauseResumeButton.enabled = false;
				} else {
					audioPlayer.release();
					audioPlayer.url = e.source.urlStream;
					e.source.backgroundImage = 'button/but_RadioOn.png';
					pauseResumeButton.backgroundImage = 'button/but_Pause.png';
					pauseResumeButton.enabled = true;
					audioPlayer.start();
				}
			} else {
				audioPlayer.url = e.source.urlStream;
				e.source.backgroundImage = 'button/but_RadioOn.png';
				pauseResumeButton.backgroundImage = 'button/but_Pause.png';
				pauseResumeButton.enabled = true;
				audioPlayer.start();
				loopIndicator = setInterval(indAudio, 100);
			}
		}
	});
}

//--------------------------------------------------------------------------------------------
win.open();