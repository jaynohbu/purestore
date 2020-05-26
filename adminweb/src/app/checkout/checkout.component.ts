import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CheckoutService } from '../service/checkout.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
 private items:any[];
  private totalPrice:number=0;
  currencyId:string="$";

  constructor(private route: ActivatedRoute, private checkoutService:CheckoutService) { }
  
  ngOnInit() {
    this.items=[];
    this.route.params.subscribe(params => {
      let key = params['key'];
      this.checkoutService.getCheckout(key).toPromise().then((result:any) => {
      
        this.items=result.body.items;
        if (this.items.length > 0) this.currencyId=this.items[0].currencyId;
        this.totalPrice=this.items.reduce((pre,e)=>{
          console.log(e)
          pre+=e.price * e.quantity;
          console.log(pre);
          return pre;

        },0);

        
        
      }).catch((err) => {
        
      });
     

    });

  }
}
