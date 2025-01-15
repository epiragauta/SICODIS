import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {
  getPointResolution,
  get as getProjection,
  transform,
} from 'ol/proj.js'
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import GeoJSON from "ol/format/GeoJSON.js";
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import {OverviewMap, defaults as defaultControls} from 'ol/control.js';

@Component({
  selector: 'app-reports-map',
  standalone: true,
  imports: [],
  templateUrl: './reports-map.component.html',
  styleUrl: './reports-map.component.scss'
})
export class ReportsMapComponent implements OnInit{

  map!: Map;
  highlight: any;
  dptosUrl:string= "/assets/data/departamentos.geojson";
  mpiosUrl:string= "/assets/data/municipios.geojson";
  featureOverlay: any;

  colorHigh = "#ff5733de";
  colorHighStroke = "#C70039DE";
  colorMedium = "#4133ffde";
  colorMediumStroke = "#3107a4DE";
  colorLow = "#eff810de";
  colorLowStroke = "#8d9220DE";
  colorVeryLow = "#e5e1e1de";
  colorVeryLowStroke = "#c6c6c6de";
  colorGray = "rgb(235,235,235, .15)";
  colorGrayStroke = "rgb(210,210,210, .4)";

  colors = [this.colorHigh, this.colorMedium, this.colorLow, this.colorVeryLow];
  colorStroke = [this.colorHighStroke, this.colorMediumStroke, this.colorLowStroke, this.colorVeryLowStroke];

  overviewMapControl: any = new OverviewMap({
    // see in overviewmap-custom.html to see the custom CSS used
    className: 'ol-overviewmap ol-custom-overviewmap',
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    collapseLabel: '\u00BB',
    label: '\u00AB',
    collapsed: false,
  });

  ngOnInit(): void {
    console.log("ReportsMapComponent :: ngOnInit");
    const vectorSrcDptos = new VectorSource({
      url: this.dptosUrl,
      format: new GeoJSON(),
    });
    const dptosLyr = new VectorLayer({
      declutter: true,
      source: vectorSrcDptos,
    });

    const mpiosLyr = new VectorLayer({
      declutter: true,
      source: new VectorSource({
        url: this.mpiosUrl,
        format: new GeoJSON(),
      }),
    });

    this.featureOverlay = new VectorLayer({
      source: new VectorSource(),
      style: {
        'stroke-color': 'rgba(255, 0, 0, 0.2)',
        'stroke-width': 4,
      },
    });

    this.map = new Map({
      controls: defaultControls().extend([this.overviewMapControl]),
      view: new View({
        center: transform([-74, 4], 'EPSG:4326', "EPSG:3857"),
        zoom: 6,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        dptosLyr,
        /*mpiosLyr,*/
        this.featureOverlay
      ],
      target: 'ol-map'
    });

    let that = this;
    /* this.map.on('pointermove', function (evt) {
      if (evt.dragging) {
        console.log('pointermove :: dragging');
        return;
      }
      const pixel = that.map.getEventPixel(evt.originalEvent);
      that.displayFeatureInfo(pixel);
    }); */


    vectorSrcDptos.on("featuresloadend", function (evt){
      console.log("dptosLyr vector src has been rendered");
      vectorSrcDptos.getFeatures().map(feature => {
        let i = that.rndmColor();
        let c = that.colors[i];
        let cs = that.colorStroke[i];
        feature.setStyle([new Style({
          fill: new Fill({
            color: c
          }),
          stroke: new Stroke({
            color: cs
          })
        })])
      });
    });
  }

  rndmColor() {
    return Math.ceil(Math.random() * 2);
  }


  displayFeatureInfo(pixel: any) {
    console.log("displayFeatureInfo");
    const feature = this.map.forEachFeatureAtPixel(pixel, function (feature: any) {
      return feature;
    });

    if (feature !== this.highlight) {
      if (this.highlight) {
        this.featureOverlay.getSource().clear();
      }
      if (feature) {
        let clone = feature.clone();
        clone.setStyle([new Style({
          fill: new Fill({
            color: 'rgba(0, 255, 255, 0.6)'
          })
        })])
        this.featureOverlay.getSource().addFeature(clone);
      }
      this.highlight = feature;
    }
  };

}
