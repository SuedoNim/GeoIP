import { Component, ElementRef, Input, NgIterable, Output, TemplateRef, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModule, NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { basePlacements } from '@popperjs/core';
import { Json } from 'sequelize/types/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'GeoIP';

  @Input('users') users : Array<{id:number, name:string, ip:string, phone:string}> = [];
  @Input('selectedUser') selectedUser : {id:number, name:string, ip:string, phone:string} = {id:0,name:'',ip:'',phone:''};
  @Input('coordinates') coordinates : {lon:number, lat:number} = {lon:0,lat:0};
  @Input('mapUrl') mapUrl : {frame:SafeResourceUrl, href: SafeResourceUrl} = {frame:'', href: ''};
  @Input('search') search : string = '';
  domsanitizer: DomSanitizer; 
	constructor(private offcanvasService: NgbOffcanvas,private sanitizer: DomSanitizer) 
  {
    this.domsanitizer = sanitizer;
    this.updateFields(null);
  }

  async getNames(){
    return this.users.map(item => item.name) as NgIterable<string>;
  }

  async updateFields(event:any) {
    let search = event == null ? '' : event.target.value;
    let query : string = search == '' ? 'select * from users order by name;': `select * from users where name like '%${search}%' order by name;`;

    let body = new FormData();
    body.append('Content-Type', 'application/json');
    body.append('apikey', '2TUCOZeRsi6ul7TgnQTNUrbcVjP');
    body.append('dbowner', 'SuedoNim');
    body.append('dbname', 'GeoIP.db');
    body.append('sql', btoa(query));
    this.users = [];
    await fetch('https://api.dbhub.io/v1/query',{ method: 'post', body: body })
      .then(async (response) => { 
        try {
        const data = await response.json();
        let arr = data
          .map((item:any) => item
            .map((item:any) => item['Value']))
          .filter((item:any)=> item[0] != null);
        let res:Array<{id:number, name:string, ip:string, phone:string}> = arr.map((item:any)=>{
          let field: {id:number, name:string, ip:string, phone:string} = {
            id: item[0],
            name: item[1],
            ip: item[2],
            phone: item[3]
          }
          this.users.push(field);
        });
          console.log(arr);
        } catch (err) {
          console.log(err);
        } 
      }) as Array<{id:number, name:string, ip:string, phone:string}>;

    console.log(this.users);
  }

  closeResult = '';
  
	async open(content:any, index: number) {
    this.selectedUser = this.users[index];
    await fetch(`http://ip-api.com/json/${this.selectedUser.ip}`)
      .then(async (response) => {
        try {
          const data = await response.json();
          this.coordinates = {lon: data.lon, lat: data.lat };
          let mapUrlFrame = `https://www.openstreetmap.org/export/embed.html?bbox=${this.coordinates.lon}%2C${this.coordinates.lat}%2C${this.coordinates.lon}%2C${this.coordinates.lat}&amp;layer=mapnik&amp;marker=${this.coordinates.lon}%2C${this.coordinates.lat}`;
          let mapUrlHref = `https://www.openstreetmap.org/?mlat=${this.coordinates.lat}&amp;mlon=${this.coordinates.lon}#map=18/${this.coordinates.lat}/${this.coordinates.lon}`;
          this.mapUrl = 
            {
              frame: this.domsanitizer.bypassSecurityTrustResourceUrl(mapUrlFrame),
              href: this.domsanitizer.bypassSecurityTrustResourceUrl(mapUrlHref)
            };
        } catch (err) {
          console.log(err);
        }         
      });
		this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			}
		);
  }
}