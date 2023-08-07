import { Component, Input, NgIterable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // Declare Observable Properties
  @Input('users') users : Array<{id:number, name:string, ip:string, phone:string}> = [];
  @Input('selectedUser') selectedUser : {id:number, name:string, ip:string, phone:string} = {id:0,name:'',ip:'',phone:''};
  @Input('coordinates') coordinates : {lon:number, lat:number} = {lon:0,lat:0};
  @Input('mapUrl') mapUrl : {frame:SafeResourceUrl, href: SafeResourceUrl} = {frame:'', href: ''};
  @Input('search') search : string = '';

  // Initialize
  title = 'GeoIP';
  closeResult = '';
  domsanitizer: DomSanitizer; 
	constructor(private offcanvasService: NgbOffcanvas, private sanitizer: DomSanitizer) 
  {
    this.domsanitizer = sanitizer;
    this.updateFields(null);
  }

  // Use input field to filter users
  async updateFields(event:any) {
    // Get filter. As a level of security, removed the ' character because it can be used to tamper the query. 
    // Normally stored procedures are recommended, and this is riskier because I didn't add any security to my DB.
    let search = event == null || event.target.value.includes(`'`) ? '' : event.target.value;
    // Generate query, default acquires all entires
    let query : string = search == '' ? 'select * from users order by name;': `select * from users where name like '%${search}%' order by name;`;

    // Calling query, and parsing it into the "observable" array - users.
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
  
  // Open side panel to get details on selected user
	async open(content:any, index: number) {
    // Move observable user to the index of the user selected.
    this.selectedUser = this.users[index];
    // Fetch coordinates
    await fetch(`http://ip-api.com/json/${this.selectedUser.ip}`)
      .then(async (response) => {
        try {
          const data = await response.json();
          this.coordinates = {lon: data.lon, lat: data.lat };
          // Update links
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
    // Close panel
    this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' });
  }
}