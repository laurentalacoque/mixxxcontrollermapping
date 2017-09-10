## MIXXX Controller mapping for Hercules DJ Controller Instinct (S)
*based on the work of mich@softwareschneiderei.ch*  
*continued by Stephan Martin*  
*continued by freaktechnik*  
*continued by BangL*  
  
http://www.mixxx.org/forums/viewtopic.php?f=7&t=3907  
http://mixxx.org/  
  
  
### Mapping descriptions


#### Hot cues

Select/store a hotcue 1-4 by pressing one of the 4 buttons,
of delete a hotcue by holding down shift (Vinyl) while doing so.

#### Loops

1: Loop in
1: Loop out  
3: Halve looping time  
4: Looping off  

#### Headpones +/- buttons:

Buttons are not implemented software side. The Controller takes care of adjusting the volume  
of the controllers headphone plug. Mixxx adjustes the gain independendly  
of the controller.  

#### Tempo / Pitch

The Pitch levers change tempo permanently,
The +/- buttons change it temporary (useful for correcting phase while beatmatching)  
Pressing Plus- and Minus-Buttons together resets the Pitch to Zero.  

#### JogWheels

Touch gently on the side to perform pitch bend fine tuning,
or press them down to do pausing / scratching.


### Planned / Todo:

* Folder browsing is not fully implemented yet. Folders can't be opened/closed yet.
* Add a small delay to the feature that browses files up/down further while holding down the button.
* Shifted headphone +- switches should control master gain, but without changing headphone volume hardware side. Not sure if surpressing the hardware side handling is actually possible though.
* The functionality of Effect and Sample Buttons are neither tested nor documented yet.
* Find more useful uses for the shift (vinyl) button and implement them.
* Bind "Filter" to shifted JogWheels.
