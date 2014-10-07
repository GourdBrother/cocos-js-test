var res = {
    //simple plane
    hero_png:"res/hero.png",
    plane1_png:"res/PaperPlane.png",
    plane2_png:"res/PaperPlaneSmall.png",
    plane3_png:"res/GodPlane.png",
    plane4_png:"res/LXPlane.png",
    plane5_png:"res/XPlane.png",
    bullet_png:"res/bullet.png",
    back_png:"res/sky.png",
    shot_mp3:"res/Music/fireEffect.mp3",
    hit_mp3:"res/Music/explodeEffect.mp3",
    back_mp3:"res/Music/bgMusic.mp3",

    //plane
    flare_png:"res/flare.jpg",
    menu_png:"res/menu.png",
    buttonEffect_mp3:"res/Music/buttonEffet.mp3",
    mainMainMusic_mp3:"res/Music/mainMainMusic.mp3",
    texture_png:"res/textureTransparentPack.png",
    texture_plist:"res/textureTransparentPack.plist",

    //all menu
    allmenuback_jpg:"res/allmenuback.jpg",

    //remove brick(candy)
    brick_green_png:"res/candy/green.png",
    brick_null_png:"res/candy/null.png",
    brick_yellow_png:"res/candy/yellow.png",
    brick_red_png:"res/candy/red.png",
    brick_back_png:"res/candy/back.png",
    brick_pink_png:"res/candy/pink.png",
    brick_orange_png:"res/candy/orange.png",
    brick_blue_png:"res/candy/blue.png",
    brick_back_mp3:"res/candy/back.mp3",
    brick_clean_mp3:"res/candy/clean.mp3"
};

var g_allres= [];
var g_allmenures = [
    res.allmenuback_jpg
];
var g_removeres = [
    res.brick_back_png,
    res.brick_null_png,
    res.brick_red_png,
    res.brick_green_png,
    res.brick_yellow_png,
    res.brick_blue_png,
    res.brick_orange_png,
    res.brick_pink_png,
    res.brick_back_mp3,
    res.brick_clean_mp3
];
var g_simpleplaneres=[
    res.plane1_png,
    res.plane2_png,
    res.plane3_png,
    res.plane4_png,
    res.plane5_png,
    res.bullet_png,
    res.back_png,
    res.shot_mp3,
    res.hit_mp3,
    res.back_mp3
];
for (var i in res) {
    g_allres.push(res[i]);
}
