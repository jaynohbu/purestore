export class VehicleAudit {
    public toDelete: boolean;
    public total_count: number;
    public id: number;
    public dvir_id:number;
    public dsp_code: string;
    public auditor: string;
    public vin: string;
    public station: string;
    public damages: string;
    public damage_reported: string;
    public status: string;
    public resolution: string;
    public resolved_by: string;
    public additional_comments: string;
    public date: string;
    public isDot:boolean;
    public windshield: string;
    public wiper: string;
    public side_mirror: string;
    public body: string;
    public lights: string;
    public tire: string;
    public ac_heating: string;
    public packages: string;
    public uniforms: string;
    public credentials: string;
    public brakes: string;
    public safety_acc: string;
    public lic_plates:string;
    public prev_maintenance:string;
    public lights_csr:string;
    public wheels:string;
    public leaks:string;
    public type:string;
    public checked:boolean;
  
    constructor(
       
     
    ) {
        this.type="NON-DOT"
        this.safety_acc = "0";
        this.brakes = "0";
        this.credentials = "0";
        this.uniforms = "0";
        this.packages = "0";
        this.ac_heating = "0";
        this.tire = "0";
        this.lights = "0";

        this.body = "0";
        this.side_mirror = "0";
        this.wiper = "0";
        this.windshield = "0";
        this.lic_plates = "0";
        this.prev_maintenance = "0";
        this.lights_csr = "0";
        this.wheels = "0";
        this.leaks = "0";
        this.checked=false;
       
        this.id = 0;

    }
}
