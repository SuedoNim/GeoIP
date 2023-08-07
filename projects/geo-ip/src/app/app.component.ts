import { Component, ElementRef, Input, NgIterable, Output, TemplateRef, ViewChild } from '@angular/core';
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
  @Input('search') search : string = '';

	constructor(private offcanvasService: NgbOffcanvas) {}

  async getNames(){
    return this.users.map(item => item.name) as NgIterable<string>;
  }

  async updateFields(event:any) {
    let search = event.target.value;
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
  
	open(content: any) {
		this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
  }
  private getDismissReason(reason: any): string {
    if (reason === OffcanvasDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === OffcanvasDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on the backdrop';
    } else {
      return `with: ${reason}`;
    }
``}
}