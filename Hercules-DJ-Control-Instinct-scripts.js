// http://ts.hercules.com/download/sound/manuals/DJ_Instinct/QSG/DJCInstinct_Technical_specifications.pdf

var HCI = {};

// ----------   Global variables    ----------
HCI.pitchSpeedFast = true; 	// temporary Pitch Speed of +/-  true =
HCI.vinylButton = false;
HCI.pitchSwitches = new Array();
HCI.pitchSwitches["A"] = [0, 0];
HCI.pitchSwitches["B"] = [0, 0];

HCI.pitchB = [0, 0];

HCI.PlaylistMode= "File";
HCI.timerPlaylist= false;

// ----------   Functions    ----------

// called when the MIDI device is opened & set up
HCI.init = function(id, debugging) {
	this.id = id;
	this.FastPosition=[0, 0];
	this.jogFastPosition=[0, 0];

	this.allLedOff();
	midi.sendShortMsg(0x80, 0x39, 0x00);	// LED Folder
	midi.sendShortMsg(0x90, 0x38, 0x7F);	// LED File

	print ("***** Hercules DJ Instinct Control id: \"" + this.id + "\" initialized.");
};

// Called when the MIDI device is closed
HCI.shutdown = function() {
	this.allLedOff();
	print ("***** Hercules DJ Instinct Control id: \"" + this.id + "\" shutdown.");
};

// === MISC TO MANAGE LEDS ===

HCI.allLedOff = function () {
	// Switch off all LEDs
};

// Use VinylButton as "Shift"-Button
HCI.vinylButtonHandler = function(channel,control, value, status) {
	if (value == ButtonState.pressed) {
		this.vinylButton = true;
		midi.sendShortMsg(0x90, 0x35, 0x7F);	// LED Scratchmode
	} else {
		this.vinylButton = false;
		midi.sendShortMsg(0x80, 0x35, 0x00);	// LED Scratchmode
	}
};

// The button that enables/disables scratching
HCI.wheelTouch = function (channel, control, value, status) {
	if (value == ButtonState.pressed) {
		// enable scratching
		var alpha = 1.0 / 8;
		var beta = alpha / 32;
		engine.scratchEnable(group.toInt(), 128, 33 + 1 / 3, alpha, beta);
	} else {
		// disable scratching
		engine.scratchDisable(group.toInt());
	}
};
HCI.wheelTurn = function (channel, control, value, status, group) {
	// normalize value
	var newValue;
	if (value - 64 > 0) {
		newValue = value - 128;
	} else {
		newValue = value;
	}
	// check if scratching
	if (engine.isScratching(group.toInt())) {
		// scratch
		engine.scratchTick(group.toInt(), newValue);
	} else {
		// pitch bend
		engine.setValue(group, "jog", newValue);
	}
};

HCI.knobIncrement = function (group, action, minValue, maxValue, centralValue, step, sign) {
	// This function allows you to increment a non-linear value like the volume's knob
	// sign must be 1 for positive increment, -1 for negative increment
	semiStep = step / 2;
	rangeWidthLeft = centralValue - minValue;
	rangeWidthRight = maxValue - centralValue;
	actual = engine.getValue(group, action);
	if (actual < 1){
		increment = ((rangeWidthLeft) / semiStep) * sign;
	}
	else if (actual > 1) {
		increment = ((rangeWidthRight) / semiStep) * sign;
	}
	else if (actual == 1) {
		increment = (sign == 1) ? rangeWidthRight / semiStep : (rangeWidthLeft / semiStep) * sign;
	}
	if (sign == 1 && actual < maxValue) {
		newValue = actual + increment;
	}
	else if (sign == -1 && actual > minValue) {
		newValue = actual + increment;
	}
	return newValue;
};

// Pitch +/-
HCI.pitch = function (midino, control, value, status, group) {
	var speed = (this.vinylButton == true) ? "" : "_small";
	var state = (value == 0x7F) ? 1 : 0;
	switch (control) {
		case 0x11: this.pitchSwitches["A"][0] = state;
			engine.setValue(group, "rate_temp_down" + speed, state);
			break;
		case 0x12: this.pitchSwitches["A"][1] = state;
			engine.setValue(group, "rate_temp_up" + speed, state);
			break;
		case 0x2B: this.pitchSwitches["B"][0] = state;
			engine.setValue(group, "rate_temp_down" + speed, state);
			break;
		case 0x2C: this.pitchSwitches["B"][1] = state;
			engine.setValue(group, "rate_temp_up" + speed, state);
			break;
	};
	// when buttons + and - pressed simultanously
	if (this.pitchSwitches["A"][0] && this.pitchSwitches["A"][1]) {
		// reset pitch to 0
		engine.setValue(group, "rate", 0);
	};
	if (this.pitchSwitches["B"][0] && this.pitchSwitches["B"][1]) {
		engine.setValue(group, "rate", 0);
	}
};

// Up/Down-Switches
HCI.tempPitch = function (midino, control, value, status, group) {
	var rate = (value == 0x7F) ? "rate_perm_down" : "rate_perm_up" ;
	if (this.vinylButton == false) {
		rate = rate + "_small";
	}
	engine.setValue(group, rate, 1);
	engine.setValue(group, rate, 0);
};

HCI.PlaylistModeFolder = function (channel, control, value, status, group) {
	print("HCI.PlaylistModeFolder " + channel + "," + control + "," + value + "," + status + "," + group + "#");
	if (value == 0x7F) { //Button pressed
		if (this.PlaylistMode == "Folder") {
			// Doesn't work
			//engine.setValue(group,"ToggleSelectedSidebarItem",engine.getValue(group,"ToggleSelectedSidebarItem"));
		} else {
			this.PlaylistMode = "Folder";
		}
		midi.sendShortMsg(0x90, 0x39, 0x7F);	// LED Folder
		midi.sendShortMsg(0x80, 0x38, 0x00);	// LED File
	}
};

HCI.PlaylistModeFile  = function (channel, control, value, status, group) {
	print("HCI.PlaylistModeFile " + channel + "," + control + "," + value + "," + status + "," + group + "#");
	if (value == 0x7F) { //Button pressed
		if (this.PlaylistMode == "File") {
			engine.setValue(group, "LoadSelectedIntoFirstStopped", true);
		} else {
			this.PlaylistMode = "File";
		}
		midi.sendShortMsg(0x80, 0x39, 0x00);	// LED Folder
		midi.sendShortMsg(0x90, 0x38, 0x7F);	// LED File
	}
};

HCI.PlaylistPrev = function (channel, control, value, status, group) {
	print("HCI.PlaylistPrev " + channel + "," + control + "," + value + "," + status + "," + group + "#");
	if (value == 0x7F) { //Button pressed
		if (this.PlaylistMode == "File") {
			if (!this.timerPlaylist) {
				this.timerPlaylist = engine.beginTimer(100, 'HCI.PlaylistPrev(' + channel + ',' + control + ',' + value + ',' + status + ',"' + group + '")',false);
			}
			engine.setValue(group, "SelectPrevTrack", true);
		} else {
			if (this.PlaylistMode == "Folder") {
				engine.setValue(group, "SelectPrevPlaylist", true);
			} else {
				print("Unknown PlaylistMode: " + this.PlaylistMode);
			}
		}
	} else { // Buttonrelese
		if (this.timerPlaylist) {
			engine.stopTimer(this.timerPlaylist);
			this.timerPlaylist = false;
		}
	}
};

HCI.PlaylistNext = function (channel, control, value, status, group) {
	if (value == 0x7F) { //Button pressed
		if (this.PlaylistMode == "File") {
			if (!this.timerPlaylist) {
				this.timerPlaylist = engine.beginTimer(100, 'HCI.PlaylistNext(' + channel + ',' + control + ',' + value + ',' + status + ',"' + group + '")', false);
			}
			engine.setValue(group, "SelectNextTrack", true);
		} else {
			if (this.PlaylistMode == "Folder") {
				engine.setValue(group, "SelectNextPlaylist", true);
			} else {
				print ("Unknown PlaylistMode: " + this.PlaylistMode);
			}
		}
	} else { // Button relese
		if (this.timerPlaylist) {
			engine.stopTimer(this.timerPlaylist);
			this.timerPlaylist = false;
		}
	}
};

HCI.hotCue = function (midino, control, value, status, group) {
	print("HCI.hotCue " + midino + "," + control + "," + value + "," + status + "," + group + "#");
	var number = 1;
	if (control == 0xe || control == 0x28) {
		number = 2;
	} else if (control == 0xf || control == 0x29) {
		number = 3;
	} else if (control == 0x10 || control == 0x2a) {
		number = 4;
	}

	var action = "hotcue_" + number + "_";
	if (this.vinylButton == false) {
		action += "activate";
	} else {
		action += "clear";
	}
	engine.setValue(group, action, value == 0x7F ? 1 : 0);
};
