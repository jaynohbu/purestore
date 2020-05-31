
export class PageMaster {
    protected isSuperUser:boolean;
  
    constructor(protected pageName: string){
        let user = sessionStorage.getItem('user');
        if (!user) return;
        let userObj: any = JSON.parse(user);
        userObj.attributes["custom:isMgr"] == 'Y' ? this.isSuperUser = true : this.isSuperUser = false;
      
    }
   
}
