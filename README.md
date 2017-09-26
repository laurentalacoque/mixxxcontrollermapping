## MIXXX Controller mapping for Hercules DJ Controller Instinct (S)
*based on the work of mich@softwareschneiderei.ch*  
*continued by Stephan Martin*  
*continued by freaktechnik*  
*continued by BangL*  
*continued by laurentalacoque* (changes in **bold**)

http://www.mixxx.org/forums/viewtopic.php?f=7&t=3907  
http://mixxx.org/  


### Mapping descriptions


#### Hot cues

Select/store a hotcue by pressing one of the 4 buttons,  
or delete a hotcue by holding down shift (Vinyl) while doing so.  

#### Loops

1: Loop in  
2: Loop out  
3: Halve looping time  
4: Looping off  

#### Headpones +/- buttons:

Buttons are not implemented software side.  
The Controller takes care of adjusting the volume of the controllers headphone plug.  
Mixxx adjustes the gain independendly of the controller.  

#### Tempo / Pitch

The Pitch levers change tempo permanently,  
The +/- buttons change it temporary (useful for correcting phase while beatmatching)  
Pressing +/- buttons together resets the pitch.  

#### JogWheels
  
**Touch gently on the side for track selection**
or press them down to do pausing / scratching.  
Hold shift and turn to use the quick filter.  
Releasing the JogWheel then resets the filter.  

#### Folder/File Browsing

Folder: Switches from file list to folder list, or expands/collapses currently selected folder.  
File: Switches from folder list to file list, or loads currently selected file into first paused deck.  
Up/Down: Browse up/down. (Holding down possible in file list)  

### Planned / Todo:

* Shifted headphone +- switches should control master gain, but without changing headphone volume hardware side. Not sure if surpressing the hardware side handling is actually possible though.
* The functionality of Effect and Sample Buttons are neither tested nor documented yet.
* Find more useful uses for the shift (vinyl) button and implement them.
