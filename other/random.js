var Github = require('github-api');
var Firebase = require('firebase');
var mainRef = new Firebase("https://crackling-inferno-3664.firebaseio.com/");

var github = new Github({
    token:process.env.DOCKER_GITHUB_CODE,
    auth:'oauth'
});

var usernames = ["sindresorhus",
        "jashkenas",
        "substack",
        "tj",
        "kennethreitz",
        "mbostock",
        "vhf",
        "hakimel",
        "tpope",
        "JakeWharton",
        "addyosmani",
        "defunkt",
        "mitsuhiko",
        "blueimp",
        "nicklockwood",
        "bartaz",
        "necolas",
        "mrdoob",
        "sstephenson",
        "robbyrussell",
        "daneden",
        "rstacruz",
        "mattt",
        "bevacqua",
        "torvalds",
        "bbatsov",
        "ryanb",
        "madrobby",
        "progrium",
        "jakubroztocil",
        "antirez",
        "mitchellh",
        "creationix",
        "caolan",
        "mathiasbynens",
        "scottjehl",
        "desandro",
        "maxogden",
        "nvie",
        "tiimgreen",
        "maccman",
        "felixge",
        "typicode",
        "ariya",
        "dypsilon",
        "davatron5000",
        "sahat",
        "remy",
        "wycats",
        "igrigorik",
        "rwaldron",
        "nnnick",
        "chrisbanes",
        "vinta,
        "getify",
        "Prinzhorn",
        "vim-scripts",
        "kripken",
        "dimsemenov",
        "mojombo",
        "nthanmarz",
        "IanLunn",
        "peachananr",
        "jakiestfu",
        "sferik",
        "astaxie",
        "mdo",
        "chriskempson",
        "jrburke",
        "soffes",
        "crooloose",
        "prakhar1989",
        "rs",
        "octocat",
        "chjj",
        "kenwheeler",
        "LeaVerou",
        "csswizardry",
        "jaredhanson",
        "paulirish",
        "mperham",
        "daimajia",
        "ankane",
        "romaonthego",
        "bayandin",
        "douglascrockford",
        "altercation",
        "steipete",
        "mattn",
        "cantino",
        "alex",
        "ccampbell",
        "imathis",
        "alvarotrigo",
        "technomancy",
        "mrmrs",
        "aFarkas",
        "justjavac"]
    ;

var user = github.getUser();
var count = 0;

var recurse = function(count){
    user.show(usernames[count], function(err, repos) {
        if(err){
            console.log(err);
        }
        else{
            
        }
    });
};