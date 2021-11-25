let movieDataUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'

let movieData

const COLORS = ["#F6FEDB", "#E6D3A3", "#D8D174", "#B6C454", "#91972A", "#ABA9BF", "#BEB7DF"];
const GENDERS = ["Drama","Adventure","Family","Animation","Comedy","Action","Biography"];

let canvas = d3.select('#canvas')
let legend = d3.select("#legend")
let tooltip = d3.select("#tooltip")

let selectColor = (gender) => {
    for (let i in GENDERS){
        if (gender === GENDERS[i]){
            return COLORS[i];
        }
    }
    return "white";
}

let drawTreeMap = () => {

    let hierarchy = d3.hierarchy(movieData, 
        (node) => {
            return node['children']
        }
    ).sum(
        (node) => {
            return node['value']
        }
    ).sort(
        (node1, node2) => {
            return node2['value'] - node1['value']
        } 
    );

    d3.treemap()
      .size([1000,600])
      (hierarchy);
  
    let movieTiles = hierarchy.leaves();

    let block = canvas.selectAll('g')
                .data(movieTiles)
                .enter()
                .append('g')
                .attr('transform', (movie) => {
	                return 'translate (' + movie['x0'] + ', ' + movie['y0'] +')'
	            })

    block.append('rect')
        .attr('class', 'tile')
        .attr('fill', (movie) => {
            let category = movie['data']['category']
            return selectColor(category);
        })
        .attr('data-name', (movie) => {
            return movie['data']['name']
        })
        .attr('data-category', (movie) => {
            return movie['data']['category']
        })
        .attr('data-value', (movie) => {
            return movie['data']['value']
        })
        .attr('width', (movie) => {
            return movie['x1'] - movie['x0'] - 0.7
        })
        .attr('height', (movie) => {
            return movie['y1'] - movie['y0'] - 0.7
        })


    block.append('text')
        .attr('class', 'tile-text')
        .selectAll('tspan')
        .data(function (d) {
          return d.data.name.split(/(?=[A-Z][^A-Z])/g);
        })
        .enter()
        .append('tspan')
        .attr('x', 4)
        .attr('y', function (d, i) {
          return 13 + i * 14;
        })
        .text(function (d) {
          return d;
        });

    block.on("mouseover", function(d) {
            var matrix = this.getScreenCTM()
                .translate(+ this.getAttribute("cx"), + this.getAttribute("cy"));
            tooltip.html(d)
                .style("left", (window.pageXOffset + matrix.e + 15) + "px")
                .style("top", (window.pageYOffset + matrix.f - 30) + "px")
            
            let movieData = d['data']
  
            tooltip.text(
                movieData['name'] + ' : $' + movieData['value']
            )

            tooltip.attr('data-value', movieData['value'])
        })

}

let drawLegend = () =>{

    let genderLengend = legend.selectAll("g")
                            .data(GENDERS)
                            .enter()
                            .append("g")
                            .attr("x", (d,i) => i <= 3 ? 20 : 150)
                            .attr("y", (d,i) => i <= 3 ? 20 + i*20 : 20 + (i-4) * 20)
                            .attr("transform", (movie, i) => {
                                return "translate (" + (i <= 3 ? 20 : 150) + ", " + (i <= 3 ? 20 + i*20 : 20 + (i-4) * 20) + ")"
                            })
                    
    genderLengend.append("rect")
        .attr("height", 20)
        .attr("width", 20)
        .attr("fill", (d, i) => COLORS[i])
        

    genderLengend.append("text")
        .text(gender => gender)
        .attr('x', 25)
        .attr('y', 15)

}

d3.json(movieDataUrl).then(
    (data, error) => {
        if(error){
            console.log(error)
        } else {
            movieData = data;
            console.log(movieData);
            drawTreeMap();
            drawLegend();
        }
    }
)