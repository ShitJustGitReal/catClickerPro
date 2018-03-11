// THE MODEL
var model = {
    currentCat: null,
    admin: false,
    cats: [
        {
            "name": "Catelyn",
            "image": "img/cat-stark.jpg",
            "clicks": 0,
            "id": 1
        },
        {
            "name": "Biglips",
            "image": "img/cat-below.jpg",
            "clicks": 0,
            "id": 2
        },
        {
            "name": "Sunshine",
            "image": "img/cat-happy.jpg",
            "clicks": 0,
            "id": 3
        },
        {
            "name": "Catelyn",
            "image": "img/cat-stark.jpg",
            "clicks": 0,
            "id": 4
        },
        {
            "name": "Biglips",
            "image": "img/cat-below.jpg",
            "clicks": 0,
            "id": 5
        },
        {
            "name": "Sunshine",
            "image": "img/cat-happy.jpg",
            "clicks": 0,
            "id": 6
        }
    ]
};


// THE OCTOPUS

var octopus = {

    init: function () {

        var flurl = window.location.href; // grab the url
        var checkhash = flurl.indexOf("#"); // check if the url contains a #-deeplink to a specific cat-id
        if (checkhash != -1) { // if a # is not present on load, index of # is -1
            flurl = flurl.substr(flurl.lastIndexOf('#') + 1); // grab the cat id from the url
            var cats = this.getCats(); // store cats in a variable
            for (i = 0; i < cats.length; i++) { //loop over all the cats
                cat = cats[i]; // store the cat in a variable for easier access to its properties
                if (cat.id == flurl) { //if the cat id from the url matches a cat-id, set the current cat to this cat
                    this.setCurrentCat(cat);
                }
            }
        } else {
            // set our current cat to the first one in the cat list
            model.currentCat = model.cats[0];

        }
        // tell our views to initialize
        catView.init();
        catMenuView.init();
        adminView.init();
        if (model.admin == false) {
            adminView.hideAdmin();
        }
    },

    getCurrentCat: function () {
        return model.currentCat;
    },

    getCats: function () {
        return model.cats;
    },

    // set the currently-selected cat to the object passed in
    setCurrentCat: function (cat) {
        model.currentCat = cat;
    },

    // increments the counter for the currently-selected cat
    incrementCounter: function () {
        model.currentCat.clicks++;
        catView.render();
        adminView.render();
    },

    toggleAdmin: function () {
        if (model.admin) {
            model.admin = false;
            adminView.hideAdmin();
        } else {
            model.admin = true;
            adminView.showAdmin();
        };
    },
    
    update: function () {
        //Get values from inputs
        var name = adminView.adminName.val();
        var image = adminView.adminImage.val();
        var clicks = adminView.adminClicks.val();
        
        //var id = model.currentCat.id;
        model.currentCat.name = name;
        model.currentCat.image = image;
        model.currentCat.clicks = clicks;

        this.toggleAdmin(); //turn off Admin mode
        catMenuView.render();
        catView.render();
    }
};


// THE VIEWS

var catView = {

    init: function () {
        // store pointers to our DOM elements for easy access later
        this.elemCatstage = $('#catstage');
        this.elemCatname = $('#catname');
        this.elemCatimage = $('#catimage');
        this.elemCounter = $('#catcounter');

        // on click, increment the current cat's counter
        this.elemCatimage.on('click', function () {
            octopus.incrementCounter();
        });

        // render this view (update the DOM elements with the right values)
        this.render();
    },

    render: function () {
        // update the DOM elements with values from the current cat
        var currentCat = octopus.getCurrentCat();
        this.elemCounter.text(currentCat.clicks);
        this.elemCatname.text(currentCat.name);
        this.elemCatimage.attr({
            'src': currentCat.image,
            'alt': currentCat.name + currentCat.id
        });
    }
};

var catMenuView = {

    init: function () {
        // store the DOM element for easy access later
        this.elemCatmenu = $('#catmenu');

        // render this view (update the DOM elements with the right values)
        this.render();
    },

    render: function () {
        var cat, elem, i;
        // get the cats we'll be rendering from the octopus
        var cats = octopus.getCats();

        // empty the cat list
        this.elemCatmenu.html('');

        // loop over the cats
        for (i = 0; i < cats.length; i++) {
            // this is the cat we're currently looping over
            cat = cats[i];

            // make a new cat list item and set its text
            elem = document.createElement('li');
            elem.innerHTML = '<a href="#' + cat.id + '">' + cat.name + '</a>';

            // on click, setCurrentCat and render the catView
            // (this uses our closure-in-a-loop trick to connect the value
            //  of the cat variable to the click event function)
            elem.addEventListener('click', (function (catCopy) {
                return function () {
                    octopus.setCurrentCat(catCopy);
                    catView.render();
                    adminView.render();
                };
            })(cat));

            // finally, add the element to the list
            this.elemCatmenu.append(elem);
        }
    }
};


var adminView = {
    init: function () {
        this.adminName = $('#admin-catname');
        this.adminImage = $('#admin-catimage');
        this.adminClicks = $('#admin-catclicks');
        this.admin = $('#admincontainer');

        this.adminBtn = $('#admin-btn');
        this.adminCancel = $('#admin-cancel');
        this.adminSave = $('#admin-save');

        this.adminBtn.on('click', function () {
            octopus.toggleAdmin();

        });

        this.adminCancel.on('click', function () {
            octopus.toggleAdmin();

        });

        this.adminSave.on('click', function () {
            octopus.update();

        });
        this.render();
    },

    render: function () {
        var cat = octopus.getCurrentCat();
        this.adminName.val(cat.name);
        this.adminImage.val(cat.image);
        this.adminClicks.val(cat.clicks);
    },

    showAdmin: function () {
        this.admin.css('display', 'block');
    },

    hideAdmin: function () {
        this.admin.css('display', 'none');
    }
};


// START THE APP!
octopus.init();

/*
thanks for the inspiration! --> https://github.com/eferdman/cat-clicker-premium-pro/blob/master/js/script.js
*/