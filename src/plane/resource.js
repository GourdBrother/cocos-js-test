var res = {
    HelloWorld_png : "res/HelloWorld.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png",
    hero_png:"res/hero.png",
    bullet_png:"res/bullet.png",
    back_png:"res/sky.png",
    flare_png:"res/flare.jpg",
    menu_png:"res/menu.png",
    allmenuback_jpg:"res/allmenuback.jpg",
    buttonEffect_mp3:"res/Music/buttonEffet.mp3",
    mainMainMusic_mp3:"res/Music/mainMainMusic.mp3",
    texture_png:"res/textureTransparentPack.png",
    texture_plist:"res/textureTransparentPack.plist",
    shot_mp3:"res/Music/fireEffect.mp3",
    hit_mp3:"res/Music/explodeEffect.mp3",
    brick_green_png:"res/candy/green.png",
    brick_null_png:"res/candy/null.png",
    brick_yellow_png:"res/candy/yellow.png",
    brick_red_png:"res/candy/red.png",
    brick_back_png:"res/candy/back.png",
    brick_pink_png:"res/candy/pink.png",
    brick_orange_png:"res/candy/orange.png",
    brick_blue_png:"res/candy/blue.png"

};

var g_allres= [];
var g_allmenures = [
    res.allmenuback_jpg
];
var g_planemenures = [];
var g_removeres = [
    res.brick_back_png,
    res.brick_null_png,
    res.brick_red_png,
    res.brick_green_png,
    res.brick_yellow_png,
    res.brick_blue_png,
    res.brick_orange_png,
    res.brick_pink_png
];
var g_simpleplaneres=[];
for (var i in res) {
    //for simple codeing, and make long loading time
    g_allres.push(res[i]);
    g_planemenures.push(res[i]);
    g_simpleplaneres.push(res[i]);
}
console.log("res load");