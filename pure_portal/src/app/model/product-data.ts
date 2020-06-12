export class ProductData {
    public sku: Number=0;
    public description: string='';
    public availableSizes: string[];
    public sizes:string='';
    public imageUrls: string[];
    public style: string='';
    public price: string='';
    public installments: string='0';
    public currencyId: string='USD';
    public created_at: string;
    public updated_at: string;
    
    public currencyFormat: string='$';
    public isFreeShipping: boolean=false;
    public category_id: string='0';
    public category: string = 'Health';
    public title: string='';
    
    constructor(
        ) {
        this.imageUrls=[];
        this.availableSizes=[];
        this.category_id="1"
    }
}


