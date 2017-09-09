document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});

document.ontouchmove = function(e){ e.preventDefault(); } 

function SunController(){
    var Sun = this;
    
    this.galaxy = document.body;
    this.new = function(tag){
        return document.createElement(tag);
    }
    
    this.getTimes = function(lat, lon){
        console.log(lat, lon);
        now = new Date();
        
        if(lat && lon){
            // We have a lat lon
        } else {
            // We do not have a lat lon
            alert("Could not get your location, defaulted to London.")
            lat = 51.5;
            lon = -0.1;
        }
        
        // get today's sunlight times for London
        Sun.times = SunCalc.getTimes(now, lat, lon);
        
        tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        Sun.times.tomorrow = SunCalc.getTimes(tomorrow, lat, lon);
        
        Sun.moonLight = SunCalc.getMoonIllumination(now, lat, lon);
        
        Sun.appear();
        
    }
    
    this.init = function(opt){
        var lat, lon;
        //alert("init");
        if(navigator.geolocation){
            //alert("has geoloc");
            navigator.geolocation.getCurrentPosition(function(pos){
                lat = pos.coords.latitude;
                lon = pos.coords.longitude;
                Sun.getTimes(lat, lon);
            });
        } else {
            alert("Geolocation access was not available. Defaulted to London.");
            lat = 51.5;
            lon = -0.1;
            
            Sun.getTimes(lat, lon);
        }    

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
        setTimeout(Sun.update, 500);
        Sun.interval = setInterval(Sun.update, 1 * 60 * 1000);
        
        var moon = Sun.new("div");
        moon.id = "moon";
        Sun.moon = moon;
        Sun.galaxy.appendChild(moon);
        
        var moon_shine = Sun.new("div");
        moon_shine.id = "moon-shine";
        moon.appendChild(moon_shine);
        
        var moon_two = Sun.new("div");
        moon_two.id = "moon-shadow";
        moon_two.style.width = (1 - Sun.moonLight.fraction) * 100 + "%";
        moon.appendChild(moon_two);
        
        
    }
    
    this.update = function(){
        now = new Date();
        //now = new Date("Sep 09 2017 21:30:00 GMT+0100");
        
        var max = 0.90;
        if(now <= Sun.times.solarNoon){
            // Sun is rising
            duration = Sun.times.solarNoon - Sun.times.sunrise;
            covered = now - Sun.times.sunrise;
            remaining = duration - covered;
            percent = (covered / duration) * 100;  
            Sun.star.style.bottom = max * percent + "%";
        } else if(Sun.times.sunset >= now){
            // Sun is setting
            duration = Sun.times.sunset - Sun.times.solarNoon;
            covered = now - Sun.times.solarNoon;
            remaining = duration - covered;
            percent = (covered / duration) * 100; 
            Sun.star.style.bottom = (max * 100) - (max * percent) + "%";
        } else if(now <= Sun.times.tomorrow.nadir){
            // Sun has set, moon is rising
            // Do not use moon times yet. Maybe in future version.
            Sun.star.style.bottom = "-100px";
            duration = Sun.times.tomorrow.nadir - Sun.times.sunset;
            covered = now - Sun.times.sunset;
            remaining = duration - covered;
            percent = (covered / duration) * 100;
            Sun.moon.style.bottom = max * percent + "%";
        } else if(now <= Sun.times.tomorrow.sunrise){
            // Moon is setting
            // Do not use moon times yet. Maybe in future version.
            Sun.star.style.bottom = "-100px";
            
            duration = Sun.times.tomorrow.sunrise - Sun.times.tomorrow.nadir;
            covered = now - Sun.times.tomorrow.nadir;
            remaining = duration - covered;
            percent = (covered / duration) * 100; 
            Sun.moon.style.bottom = (max * 100) - (max * percent) + "%";
        } else {
            console.log("Sun times need to be re-initialised.");
            Sun.init(); // Init x2 for multidays? idek
            Sun.moon.style.bottom = "-100px";
            Sun.star.style.bottom = 0;
        }
    }
}

function Star(){
    // Create a single point star
    star = document.createElement("div");
    star.classList.add("star");
    star.style.background = "white";
    return star;
}

function GalaxyController(){
    var Galaxy = this;
    this.stars = [];
    
    this.init = function(opt){
        this.Sun = opt.sun;
        Galaxy.Sun.init();
        
        if(opt.stars){
            
            Galaxy.Sun.galaxy.stars = Galaxy.Sun.new("div");
            Galaxy.Sun.galaxy.stars.id = "stars";
            Galaxy.Sun.galaxy.appendChild(Galaxy.Sun.galaxy.stars);
            
            for(x of new Array(opt.stars)){
                o  = Math.random();
                if(o > Math.random() - 0.4){
                    star = new Star();
                    star.style.top = Math.floor(Math.random() * 100) + "%";
                    star.style.left = Math.floor(Math.random() * 100) + "%";
                    star.style.opacity = o;
                    Galaxy.addStar(star);
                }
                
            }
            
            Galaxy.twinkleStars();
        }
    }
    
    this.addStar = function(star){
        Galaxy.Sun.galaxy.stars.appendChild(star);
        Galaxy.stars.push(star);
    }
    
    
    this.twinkleStars = function(){
        stars = Galaxy.stars;
        
        for(star of stars){
            if(Math.random() > 0.9){
                star.style.animationName = "w-y-b";
                star.style.animationDuration = 2 + (Math.random() * 10) + "s";
                star.style.animationIterationCount = "infinite";
            } else if(Math.random() > 0.8){
                star.style.animationName = "w-g-g";
                star.style.animationDuration = 2 + (Math.random() * 10) + "s";
                star.style.animationIterationCount = "infinite";
            }
            
        }
    }
}

var Galaxy = new GalaxyController();
Galaxy.init({
    sun: new SunController(),
    stars: 100
})
