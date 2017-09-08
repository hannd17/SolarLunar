

function SunController(){
    var Sun = this;
    
    this.galaxy = document.body;
    this.new = function(tag){
        return document.createElement(tag);
    }
    
    this.init = function(opt){
        // get today's sunlight times for London
        Sun.times = SunCalc.getTimes(new Date(), 51.5, -0.1);

    }
    
    this.appear = function(opt){
        
        var sun = Sun.new("div");
        sun.id = "sun";
        sun.classList.add("sun");
        
        var sun_two = Sun.new("div");
        sun_two.classList.add("sun");
        sun_two.classList.add("sun-two");
        sun.appendChild(sun_two);
        
        var sun_circle = Sun.new("div");
        sun_circle.classList.add("sun");
        sun_circle.classList.add("sun-circle");
        sun_two.appendChild(sun_circle);
        
        Sun.galaxy.appendChild(sun);
        Sun.star = sun;
        setTimeout(Sun.move, 100);
        Sun.interval = setInterval(Sun.move, 1 * 60 * 1000);
    }
    
    this.move = function(){
        now = new Date();
        if(now <= Sun.times.solarNoon){
            // Sun is rising
            duration = Sun.times.solarNoon - Sun.times.sunrise;
            covered = now - Sun.times.sunrise;
            remaining = duration - covered;
            percent = (covered / duration) * 100;           
            Sun.star.style.bottom = 0.5 * percent + "%";
        } else if(Sun.times.sunset >= now){
            // Sun is setting
            duration = Sun.times.sunset - Star.times.solarNoon;
            covered = now - Sun.times.solarNoon;
            remaining = duration - covered;
            percent = (covered / duration) * 100;           
            Sun.star.style.top = 0.5 * percent + "%";
        } else if(now >= Sun.times.sunset){
            // Sun has set, moon is rising
        } else {
            // Moon is setting
        }
    }
}

function Star(){
    // Create a single point star
    star = document.createElement("div");
    star.classList.add("star");
    return star;
}

function Constellation(n){
    // Return a collection of Stars with positions relative to eachother
    n = n ? (n > 50 ? 50 : n) : 50;
    stars = [];
    max_spread = 50;
    for(x of new Array(n)){
        star = new Star();
        star.style.top = Math.floor(Math.random() * max_spread) + "px";
        star.style.left = Math.floor(Math.random() * max_spread) + "px";
        stars.push(star);
    }
    
    cx = document.createElement("div");
    cx.classList.add("cx");
    cx.style.top = Math.floor(Math.random() * 100) + "%";
    cx.style.left = Math.floor(Math.random() * 100) + "%";
    
    for(x of stars){
        cx.appendChild(x);
    }
    
    return cx;
}

function SpaceController(){
    // Add a load of constellations (n) to the document
    
    this.init = function(n){
        n = n ? n : 50;
        for(x of new Array(n)){
            document.body.appendChild(new Constellation());
        }
    }
}

var Sun = new SunController();
Sun.init();
Sun.appear();

var Space = new SpaceController();

Space.init();
