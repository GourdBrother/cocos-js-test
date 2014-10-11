
var CONFIG = CONFIG||{};
CONFIG.SCORE = 0;

var PlaneGameOverLayer = cc.Layer.extend({
    ctor:function(){
        this._super();
        this.init();
    },
    init:function(){
        var back = new cc.Sprite(res.back_png);
        var winSize = cc.winSize;
        this.addChild(back);
        make_center(back);
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
        var scene = new SimplePlaneScene();
        cc.director.runScene(new cc.TransitionFade(0.5, scene));
    }
});
var SimplePlaneLayer = cc.Layer.extend({
    hero:null,
    pos:null,
    bullets:null,
    enemys:null,
    enemy_bullets:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.init();
    },
    _life:4,
    score:0,
    scoreBoard:null,
    _lifeSprites:[],
    init:function(){
        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        this._life = 4;
        this._lifeSprites = [];
        for(var i = 0; i< this._life; i++){
            var sprite = cc.Sprite.create(res.plane2_png);
            sprite.setScale(0.5);
            sprite.attr({
              x:30+i*30,
              y:size.height-20
            });
            this.addChild(sprite, 2);
            this._lifeSprites.push(sprite);
        }

        var goBackLabel = new cc.LabelTTF("return", "Arial", 22);
        var goBackLabelItem = new cc.MenuItemLabel(goBackLabel,AllMenuScene.onGameReturnAllMenu);
        var menu = new cc.Menu(goBackLabelItem);
        menu.attr({
            x: size.width - 30,
            y: 20
        });
        this.addChild(menu, 1);

        var back = new cc.Sprite(res.back_png);
        back.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));
        this.addChild(back);


        this.hero = new cc.Sprite(res.plane1_png);
        this.hero.setScale(0.5);
        this.pos = {x:size.width/2, y:size.height/2};
        this.hero.setPosition(cc.p(this.pos.x, this.pos.y));
        this.addChild(this.hero);
        //这里创建了一个匿名的Listener对象，所以onTouchBegan的this是这个Listener
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:this.onKeyPressed,
            onKeyReleased:this.onKeyReleased
        }, this);
        this.schedule(this.shot, 0.5);
        this.schedule(this.enemyUpdate, 0.3);
        // schedule's second param 0 means check every frame(1/60 s)
        this.schedule(this.hit);
        this.bullets = [];
        this.enemys = [];
        this.enemy_bullets = [];

        this.score = 0;
        this.scoreBoard = cc.LabelTTF.create(this.score.toString(), "Impact", 28);
        this.scoreBoard.setColor(cc.color.YELLOW);
        this.scoreBoard.setPosition(cc.p(3*cc.winSize.width/4, cc.winSize.height - 40));
        this.addChild(this.scoreBoard);
        cc.audioEngine.playEffect(res.back_mp3, true);
        return true;
    },
    loseLife:function(num){
        this._life -= num;
        for(var i = this._lifeSprites.length-1; i > this._life-1 && i >= 0; i--){
           this.removeChild(this._lifeSprites[i]);
        }
        if(this._life < 0){
            this.gameOver();
        }
    },
    gameOver:function(){
        CONFIG.SCORE = this.score;
        cc.audioEngine.stopMusic();
        cc.audioEngine.stopAllEffects();
        var scene = new cc.Scene();
        scene.addChild(new PlaneGameOverLayer);
        cc.director.runScene(new cc.TransitionFade(1.2, scene));

    },
    hit:function(){
        var hero_box = this.hero.getBoundingBox();
        for(var i in this.enemys){
            var enemy = this.enemys[i];
            var enemy_box = enemy.getBoundingBox();
            if(cc.rectIntersectsRect(hero_box, enemy_box)){
                this.loseLife(1);
                var enemy_index = this.enemys.indexOf(enemy);
                if(enemy_index>-1){
                    this.enemys.splice(enemy_index, 1);
                    this.removeChild(enemy);
                }
                //如果敌机和自己相撞，就不判断敌机被子弹打中了
                continue;
            }
            for(var j in this.bullets){
                var bullet = this.bullets[j];
                var bullet_box = bullet.getBoundingBox();
                if(cc.rectIntersectsRect(bullet_box, enemy_box)) {
                    this.score+= enemy.score;
                    this.scoreBoard.setString(this.score);
                    cc.audioEngine.playEffect(res.hit_mp3);

                    var bullet_index = this.bullets.indexOf(bullet);
                    if (bullet_index > -1) {
                        this.bullets.splice(bullet_index, 1);
                        this.removeChild(bullet);
                    }
                    enemy.life--;
                    if (enemy.life > 0) {
                       return ;
                    }
                    var enemy_index = this.enemys.indexOf(enemy);
                    if(enemy_index>-1){
                        this.enemys.splice(enemy_index, 1);
                        this.removeChild(enemy);
                    }
                }
            }
        }
        for(var i in this.enemy_bullets){
            var enemy_bullet = this.enemy_bullets[i];
            var enemy_bullet_box = enemy_bullet.getBoundingBox();
            if(cc.rectIntersectsRect(hero_box, enemy_bullet_box)){
                this.loseLife(1);
                var enemy_bullet_index = this.enemy_bullets.indexOf(enemy_bullet);
                if(enemy_bullet_index> -1){
                    this.enemy_bullets.splice(enemy_bullet_index, 1);
                    this.removeChild(enemy_bullet);
                }
            }
        }
    },
    _EnemyType:[
        {text:res.plane2_png, life:1, shot:false, size:1, speed:3,score:1},
        {text:res.plane3_png, life:2, shot:true, size:1, speed:2, score:3},
        {text:res.plane2_png, life:1, shot:false, size:1, speed:3, score:1},
        {text:res.plane4_png, life:2, shot:true, size:1, speed:2, score:3},
        {text:res.plane2_png, life:1, shot:false, size:1, speed:3, score:1},
        {text:res.plane5_png, life:3, shot:true, size:2, speed:1, score:5}
        ],
    enemyUpdate:function(){
        var speedType =1.0;
        if(this.score >100){
            speedType = 2.0;
        }
        var target;
        var type = Math.floor(Math.random()*this._EnemyType.length);
        var enemyType = this._EnemyType[type];
        target = cc.Sprite.create(enemyType.text);
        target.life = enemyType.life;
        target.score = enemyType.score;
        target.setScale(0.5*enemyType.size);
        target.setRotation(180);
        var minX = target.getContentSize().width/2;
        var maxX = cc.winSize.width-target.getContentSize().width/2;
        var x = Math.random()*(maxX-minX)+minX;
        var minDuration = 7.0;
        var maxDuration = 10.0;
        var duration = minDuration + (maxDuration-minDuration)*Math.random();
        duration = (duration/enemyType.speed)/speedType;
        target.setPosition(cc.p(x, cc.winSize.height-target.getContentSize().height/2));
        var actionMove = new cc.MoveTo (duration, cc.p(x, -target.getContentSize().height));
        var actionMoveDone = new cc.CallFunc(this.Fin, this);
        target.runAction(new cc.Sequence(actionMove, actionMoveDone));
        target.setTag(2);
        this.addChild(target);
        this.enemys.push(target);

        if(!enemyType.shot){
            return ;
        }
        //add enemy bullet
        var bullet = cc.Sprite.create(res.bullet_png, cc.rect(0,50,33,70));
        bullet.setScale(0.5);
        bullet.setRotation(180);
        bullet.setPosition(cc.p(target.x, target.y));
        //enemy bullet speed(2s to cross the screen)
        duration = ((target.getPosition().y/cc.winSize.height)*2)/speedType;
        actionMove = new cc.MoveTo(duration, cc.p(target.getPosition().x, 0));
        actionMoveDone = new cc.CallFunc(this.Fin, this);
        bullet.runAction(new cc.Sequence(actionMove, actionMoveDone));
        bullet.setTag(3);
        this.addChild(bullet);
        this.enemy_bullets.push(bullet);
    },
    shot:function(){
        var speedType = Math.floor(this.score/50)+1;
        this.schedule(this.shot, 0.3/speedType);
        var hero_pos = this.hero.getPosition();
        var bulletDuration = 1;
        var bullet = cc.Sprite.create(res.bullet_png, cc.rect(0,0,33,33));
        bullet.setPosition(cc.p(hero_pos.x, hero_pos.y+ bullet.getContentSize().height));
        //hero bullet speed(1s to cross the screen)
        var time = (cc.winSize.height - hero_pos.y - bullet.getContentSize().height/2)/cc.winSize.height;
        var actionMove = cc.moveTo(bulletDuration *time, cc.p(hero_pos.x, cc.winSize.height));
        var actionMoveDone = cc.callFunc(this.Fin, this);
        bullet.runAction(cc.sequence(actionMove, actionMoveDone));
        cc.audioEngine.playMusic(res.shot_mp3, false);
        bullet.setTag(1);
        this.addChild(bullet);
        this.bullets.push(bullet);
    },
    Fin:function(sprite){
        this.removeChild(sprite, true);
        var type = sprite.getTag();
        switch(type){
            case 1:
                var index1 = this.bullets.indexOf(sprite);
                if(index1 > -1){
                    this.bullets.splice(index1, 1);
                }
                break;
            case 2:
                var index2= this.enemys.indexOf(sprite);
                if(index2 > -1) {
                    this.enemys.splice(index2, 1);
                }
                break;
            case 3:
                var index3= this.enemy_bullets.indexOf(sprite);
                    if(index3 > -1) {
                        this.enemy_bullets.splice(index3, 1);
                    }
                break;
        }
    },
    onTouchBegan:function(touch){
        console.log("touch begin");
        var point = touch.getLocation();
        //注意这里的touch_start是当前listener类的元素，不是layer的
        this.touch_start = {x:point.x, y:point.y};
        return true;
    },
    onTouchMoved:function(touch, event){
        console.log("touch moved");
        var point = touch.getLocation();
        var hero = event.getCurrentTarget().hero;
        if(Math.abs(point.x-hero.x) > 50 || Math.abs(point.y-hero.y)>50){
            //鼠标瞬移了(非拖动),不移动
            return ;
        }

        this.touch_end = {x:point.x, y:point.y};
        //通过传入的event的_currentTarget来获得this对象
        //特别说明这种_开头的对象是私有对象，h5访问是可以的，但是编译成apk的话就访问不了了，所以这样写android上面会无法触控
        //应该通过event.getCurrentTarget()函数来获取对象,其实就是调用一个公开的方法将私有变量获得了
        //event._currentTarget.hero.setPosition(cc.p(point.x, point.y));
        hero.setPosition(cc.p(point.x, point.y));
    },
    onTouchEnded:function(touch){
        console.log("touch end");
        var point = touch.getLocation();
        this.touch_end = {x:point.x, y:point.y};
        cc.log("("+this.touch_start.x+","+this.touch_start.y+")("+this.touch_end.x+","+this.touch_end.y+")");
    },
    onKeyPressed:function(key, event){
        console.log("press");
        var x_move = 0;
        var y_move=0;
        var move_distance = 40;
        //var hero = event._currentTarget.hero;
        var hero = event.getCurrentTarget().hero;
        switch(key) {
            case 37:
                x_move = -move_distance;
                break;
            case 38:
                y_move = move_distance;
                break;
            case 39:
                x_move = move_distance;
                break;
            case 40:
                y_move = -move_distance;
                break;
        }
        hero.setPosition(cc.p(hero.x+x_move, hero.y+y_move));
    },
    onKeyReleased:function(){
        console.log("released");
    }
});

var SimplePlaneScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new SimplePlaneLayer();
        this.addChild(layer);
    }
});

