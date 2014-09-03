/**
 *
 * Created by WG on 2014/9/4.
 */
var GameOverLayer = cc.Layer.extend({
  ctor:function(){
      this._super();
      this.init();
  },
  init:function(){
      var back = new cc.Sprite(res.brick_back_png);
      var winSize = cc.winSize;
      this.addChild(back);
      back.attr({
        x: winSize.width/2,
        y: winSize.height/2
      });
      var over = new cc.LabelTTF("Game Over", "Arial", 40);
      over.setColor(cc.color.RED);
      var score = new cc.LabelTTF("Your Score is "+ CONFIG.SCORE,  "Arial", 40);
      score.setColor(cc.color.YELLOW);
      var retry = new cc.LabelTTF("retry",  "Arial", 40);
      var retryLabelItem = new cc.MenuItemLabel(retry ,this.onRetry, this);
      var menu = new cc.Menu(retryLabelItem);
      this.addChild(over);
      this.addChild(score);
      this.addChild(menu);
      over.attr({
          x: winSize.width/2,
          y: winSize.height/2 +30
      });
      menu.attr({
          x: winSize.width/2,
          y: winSize.height/2 - 30
      });
      score.attr({
          x: winSize.width/2,
          y: winSize.height/2
      });
  },
  onRetry:function(){
      var scene = new RemoveScene();
      cc.director.runScene(new cc.TransitionFade(0.5, scene));
  }
});
