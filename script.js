

function SunController(){
    var Sun = this;
    
    this.galaxy = document.body;
    this.new = function(tag){
        return document.createElement(tag);
    }
    
    this.init = function(opt){
        // get today's sunlight times for London
        Sun.times = SunCalc.getTimes(new Date(), 51.5, -0.1);
        
        tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        Sun.times.tomorrow = SunCalc.getTimes(tomorrow, 51.5, -0.1);

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
        moon.classList.add("moon");
        Sun.moon = moon;
        Sun.galaxy.appendChild(moon);
    }
    
    this.update = function(){
        now = new Date();
        //now = new Date("Sep 10 2017 05:00:32 GMT+0100");
        
        var max = 0.8;
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
            Sun.init();
            Sun.moon.style.bottom = "-100px";
            Sun.star.style.bottom = 0;
        }
    }
}


var Sun = new SunController();
Sun.init();
Sun.appear();