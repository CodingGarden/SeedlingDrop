# Drop Game

A twitch overlay drop game. Type `!drop <image | emote>` in the chat to play.

>Original Penguin Drop game by [Instafluff](https://www.twitch.tv/instafluff). See the original code [here](https://github.com/instafluff/PenguinDrop).

## TODO

* [x] Setup client
* [x] Get target on the screen at the bottom / center
* [x] Get drop image on the screen with swaying animation
* [ ] Game logic to drop an image
  * [x] Starts out above screen at random X
    * [x] Has random X and Y velocity
  * [x] Collision detection for edges of screen
    * [x] Reverse X velocity if hits edge
    * [x] Stop dropping when it hits the bottom of the screen
  * [x] Score drop if it lands within the target
  * [x] Twitch chat on client with emote support
  * [ ] Allow !drop with no emote, get the users avatar image from twitch api
  * [ ] Allow !drop with custom image url
  * [ ] Allow !drop with emojis
  * [ ] Coding Garden Theme
    * [ ] Drops hold seeds
    * [ ] Seeds that land on the target grow into plants
    * [ ] Plant size is relative to score
  * [ ] High score leader board stored in DB
  * [ ] When they land, little numbers need to animate out of the drops
  * [ ] Allow modifiers to effect x / y velocity
      * [ ] !drop -->