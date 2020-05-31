import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'top-navigation-control',
  templateUrl: './top-navigation-control.component.html',
  styleUrls: ['./top-navigation-control.component.scss']
})
export class TopNavigationControlComponent implements OnInit {
  hideDropMenu:boolean=true;
  constructor(private authService: AuthService,private router: Router) { }
  currentAnchor: HTMLElement;
  isSuperUser:boolean;
  ngOnInit() {
    if (!sessionStorage.getItem('mainNav'))
     sessionStorage.setItem('mainNav', 'nav-1');
    document.querySelectorAll(".link-activated").forEach(e => {
      (e as HTMLElement).classList.remove('link-activated');

    });
    let mainNavId = sessionStorage.getItem('mainNav');
 
    let elmt = document.querySelector("#" + mainNavId);
    if(elmt)
    elmt.classList.add('link-activated');

    let user = sessionStorage.getItem('user');
    if (!user) this.router.navigate(['']);
    let userObj: any = JSON.parse(user);
    userObj.attributes["custom:isMgr"] == 'Y' ? this.isSuperUser = true : this.isSuperUser = false;
  
   
  }
  anchorSubNav(){

  }
  logOut() {
    this.authService.logOut();
  }
  toSuppport(){
    window.open("https://www.edriving.com/amazon-dsp-support/", "_blank");
    
  }
  toggleDropMenu(){
    this.hideDropMenu = !this.hideDropMenu;
  }
  mainNavTo(mainNavId, noeffect?){
     if (noeffect)return;

     sessionStorage.setItem('mainNav', mainNavId);

   }

  subNavTo(event, mainNavId) {
    ///take care of the parent first 
    this.mainNavTo(mainNavId, false);

  //  //take care of the children
  //   document.querySelectorAll(".sub-link-activated").forEach(e => {
  //     (e as HTMLElement).classList.remove('sub-link-activated');

  //   })
  //   return;

    // let elmt = event.target as HTMLElement;
    // if(elmt.tagName=='SPAN')
    // elmt.parentElement.classList.add('sub-link-activated');
    // else
    //   elmt.classList.add('sub-link-activated');
   
  }

}
