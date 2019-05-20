import { LitElement, css } from 'lit-element';
import * as rocwct from '../rocwct';

/***********************************************************/
/**************** RocWct Lit Elment ************************/
/***********************************************************/
export abstract class RocWctLitElement extends LitElement {

    static get baseStyles() {
        return [css`:host { display: block; }`,
                css`button { border: none; background: transparent; outline: none; }`,
                css`button > img { cursor: pointer; width: 100%; height: 100%; }`,
                css`button > img:active { -webkit-transform: scale(0.9); transform: scale(0.9); }`
            ];
    }

    protected iconSetRoot : string = "/images/iconset-default/";

    constructor() {
        super();
    }

    registerServerEvent(event : EServerEvent, id? : string, serverEventHandler? : IServerEventCallback) {
        let evnt : ServerEventSubscription = new ServerEventSubscription();
        evnt.element = this;
        evnt.event = event;
        evnt.id = id;
        evnt.onServerEvent = serverEventHandler;
        rocwct.subscribe(evnt);
      }
}

/***********************************************************/
/******************* Server Events *************************/
/***********************************************************/
export class ServerEventSubscription {
    element : RocWctLitElement;
    event : EServerEvent;
    id? : string;
    onServerEvent : IServerEventCallback;
}

export enum EServerEvent {
    plan, lc, auto, clock, fn, state
}

export interface IServerEventCallback  {
    (data : any, event? : EServerEvent) : void;
}

/***********************************************************/
/*************** Rocrail Interfaces ************************/
/***********************************************************/

// http://json2ts.com/

export interface Lightctrl {
    converted: boolean;
}

export interface Fundef {
    timer: number;
    pushbutton: boolean;
    sound: string;
    fn: number;
    icon: string;
    iconnr: number;
    text: string;
    addr: number;
    mappedfn: number;
}

export interface Lc {
    controlcode: string;
    V_min: number;
    blockenterside: boolean;
    regulated: boolean;
    usescheduletime: boolean;
    forcesamedir: boolean;
    V_realkmh: number;
    consist: string;
    signalaspect: string;
    number: string;
    maxload: number;
    docu: string;
    V_max: number;
    len: number;
    restorespeed: boolean;
    bbtmaxdiff: number;
    id: string;
    cargo: string;
    trysamedir: boolean;
    trainlen: number;
    consist_lightsoff: boolean;
    identifier: string;
    usedepartdelay: boolean;
    V_step: number;
    standalone: boolean;
    active: boolean;
    V_Rmin: number;
    info4throttle: boolean;
    priority: number;
    restorefxalways: boolean;
    KMH_max: number;
    resetplacing: boolean;
    tourid: string;
    V_mid: number;
    V_Rmax: number;
    cmd: string;
    manuid: string;
    KMH_Rmax: number;
    evttimer: number;
    bbtcorrection: number;
    routespeedatenter: boolean;
    server: string;
    KMH_min: number;
    iid: string;
    polarisation: boolean;
    destblockid: string;
    protver: number;
    manual: boolean;
    nraxis: number;
    consist_syncfunmap: number;
    secspcnt: number;
    KMH_Rmin: number;
    v0onswap: boolean;
    mint: number;
    prot: string;
    KMH_mid: number;
    rdate: number;
    check2in: boolean;
    era: number;
    V: number;
    slavecode: string;
    KMH_Rmid: number;
    consist_synclights: boolean;
    spcnt: number;
    accelmin: number;
    usebbt: boolean;
    useshortid: boolean;
    waittime: number;
    energypercentage: number;
    throttleid: string;
    accelmax: number;
    fncnt: number;
    ent2incorr: number;
    tryoppositedir: boolean;
    secondnextblock4wait: boolean;
    cvnrs: string;
    Vmidpercent: number;
    bbtstartinterval: number;
    bbtkey: number;
    bus: number;
    commuter: boolean;
    dir: boolean;
    mtime: number;
    resumeauto: boolean;
    placing: boolean;
    mode: string;
    scheduleinithour: number;
    startuptourid: string;
    fundef: Fundef[] | Fundef;
    decfile: string;
    V_cru: number;
    decelerate: number;
    generated: boolean;
    shortin: boolean;
    radius: number;
    usemanualroutes: boolean;
    train: string;
    image: string;
    shortid: string;
    bbtsteps: number;
    manually: boolean;
    Vmaxmin: number;
    freeblockonenter: boolean;
    secaddr: number;
    modereason: string;
    runtime: number;
    weight: number;
    imagenr: number;
    pause: boolean;
    prev_id: string;
    Vmaxmax: number;
    fifotop: boolean;
    purchased: string;
    reducespeedatenter: boolean;
    KMH_cru: number;
    catnr: string;
    KMH_Rcru: number;
    blockwaittime: number;
    Vmidset: boolean;
    desc: string;
    V_Rcru: number;
    blockenterid: string;
    V_mode: string;
    adjustaccel: boolean;
    cmdDelay: number;
    color: string;
    mass: number;
    fn: boolean;
    show: boolean;
    nrcars: number;
    remark: string;
    swaptimer: number;
    oid: string;
    dirpause: number;
    dectype: string;
    V_maxkmh: number;
    blockid: string;
    maxwaittime: number;
    fx: number;
    V_maxsec: number;
    inatpre2in: boolean;
    useownwaittime: boolean;
    engine: string;
    lookupschedulevirtual: boolean;
    minenergypercentage: number;
    throttlenr: number;
    addr: number;
    V_Rmid: number;
    trainweight: number;
    value: string;
    class: string;
    eng: string;
    Vmaxkmh: number;
    restorefx: boolean;
    owner: string;
    consist_syncfun: boolean;
    informall: boolean;
    secondnextblock: boolean;
    scidx: number;
    home: string;
    lookupschedule: boolean;
    startupscid: string;
    V_hint: string;
    scheduleid: string;
    roadname: string;
}

export interface Lclist {
    lc: Lc[];
}

export interface Sg {
    type: string;
    manual: boolean;
    blockid: string;
    pre_move_y: number;
    pre_move_x: number;
    aspect: number;
    x: number;
    y: number;
    z: number;
    id: string;
    state: string;
    signal: string;
    pre_move_z: number;
    routeids: string;
    ori: string;
    locid: string;
}

export interface Sglist {
    sg: Sg[];
}

export interface Swcmd {
    id: string;
    cmd: string;
    type: string;
}

export interface St {
    bkbside: boolean;
    bkb: string;
    show: boolean;
    x: number;
    bka: string;
    y: number;
    bkaside: boolean;
    swcmd: Swcmd[];
    id: string;
    autogen: boolean;
    desc: string;
}

export interface Stlist {
    st: St[];
}

export interface Vr {
    generated: boolean;
    id: string;
    text: string;
    value: number;
}

export interface Vrlist {
    vr: Vr[];
}

export interface Fbevent {
    byroute: string;
    endpuls: boolean;
    use_timer2: boolean;
    action: string;
    from: string;
    id: string;
}

export interface Bk {
    controlcode: string;
    openblocksignal: boolean;
    minwaittime: number;
    centertrain: boolean;
    commuter: string;
    type: string;
    extstop: boolean;
    masterid: string;
    pre_move_y: number;
    pre_move_x: number;
    len: number;
    road: boolean;
    acceptident: boolean;
    typeperm: string;
    openblockid: string;
    id: string;
    state: string;
    incline: number;
    selectshortestblock: boolean;
    offsetplus: number;
    pre_move_z: number;
    signal: string;
    embeddedfbmin: boolean;
    exitspeed: string;
    mvdistance: number;
    freeblockonenter: boolean;
    terminalstation: boolean;
    mainline: boolean;
    mvscale: number;
    openblocksignalR: boolean;
    forceblocktimer: boolean;
    ttid: string;
    prev_id: string;
    waitmode: string;
    departdelay: number;
    reserved: boolean;
    electrified: boolean;
    port: number;
    allowchgdir: boolean;
    bbtfix: number;
    evttimer2: number;
    slaveblocks: string;
    tdV0: boolean;
    freeblockonenterplus: boolean;
    evttimer: number;
    desc: string;
    embeddedfbplus: boolean;
    allowaccessoncars: boolean;
    server: string;
    wait: boolean;
    virtual: boolean;
    stopspeed: string;
    iid: string;
    polarisation: boolean;
    show: boolean;
    managerid: string;
    fifosize: number;
    speed: string;
    tdlinkblocks: boolean;
    maxwaittime: number;
    randomrate: number;
    rearprotection: boolean;
    signalR: string;
    updateenterside: boolean;
    fifoids: string;
    era: number;
    slavecode: string;
    gomanual: boolean;
    allowbbt: boolean;
    nonewaittype: string;
    addr: number;
    class: string;
    fbevent: Fbevent[];
    acceptghost: boolean;
    wsignal: string;
    ori: string;
    mvmph: boolean;
    codesen: string;
    waittime: number;
    offsetminus: number;
    openblockidR: string;
    maxkmh: number;
    td: boolean;
    entering: boolean;
    locoevent: boolean;
    freeblockonentermin: boolean;
    secondnextblock4wait: boolean;
    smallsymbol: boolean;
    wsignalR: string;
    x: number;
    y: number;
    z: number;
    sleeponclosed: boolean;
    statesignal: string;
    locid: string;
    mvrecord: boolean;
    fifogap?: number;
}

export interface Bklist {
    bk: Bk[];
}

export interface Zlevel {
    active: boolean;
    title: string;
}

export interface Tk {
    blockid: string;
    pre_move_y: number;
    pre_move_x: number;
    x: number;
    y: number;
    z: number;
    id: string;
    type: string;
    pre_move_z: number;
    routeids: string;
    ori: string;
    tknr?: number;
    prev_id: string;
    sensorid: string;
    direxception: string;
    road?: boolean;
}

export interface Tklist {
    tk: Tk[];
}

export interface Tx {
    bus: number;
    mirror: boolean;
    iid: string;
    show: boolean;
    manualinput: boolean;
    italic: boolean;
    transparent: boolean;
    block: string;
    speak: boolean;
    id: string;
    text: string;
    addr: number;
    pointsize: number;
    border: boolean;
    ori: string;
    display: number;
    refresh: number;
    bold: boolean;
    clock: boolean;
    prev_id: string;
    webcam: boolean;
    cx: number;
    cy: number;
    underlined: boolean;
    x: number;
    y: number;
    reset: boolean;
    z: number;
    desc: string;
    pre_move_y?: number;
    pre_move_x?: number;
    pre_move_z?: number;
    cmd: string;
}

export interface Txlist {
    tx: Tx[];
}

export interface Accessoryctrl {
    delay: number;
    lockroutes: string;
    active: boolean;
    interval: number;
    freeblocks: string;
}

export interface Auto {
    controlcode: string;
    server: string;
    slavecode: string;
    cmd: string;
}

export interface Sw {
    addr1: number;
    testing: boolean;
    ori: string;
    type: string;
    fieldstate: string;
    pre_move_y: number;
    pre_move_x: number;
    wantedstate: string;
    x: number;
    y: number;
    switched: number;
    z: number;
    id: string;
    state: string;
    pre_move_z: number;
    routeids: string;
    value2?: number;
    value1?: number;
    fbG: string;
    road?: boolean;
    savepos: string;
    ctcasswitchled1?: boolean;
    fbR: string;
    ctcasswitchled2?: boolean;
    frogaccessory?: boolean;
    gate2?: number;
    gate1?: number;
    ctciid2: string;
    gate1pol1?: number;
    frogswitch?: boolean;
    gate1pol2?: number;
    buspol?: number;
    decid: string;
    port0pol2?: number;
    delay?: number;
    fb2R: string;
    port0pol1?: number;
    ctcportled1?: number;
    fb2G: string;
    ctcportled2?: number;
    porttype?: number;
    iid: string;
    tdiid: string;
    fbOcc2: string;
    manual?: boolean;
    inv2?: boolean;
    ctcuid2: string;
    addr0pol2?: number;
    ctcaddr1?: number;
    prot: string;
    ctcaddr2?: number;
    tdport?: number;
    ctcuid1: string;
    addr0pol1?: number;
    ctcbus2?: number;
    ctcgateled1?: number;
    ctcgateled2?: number;
    ctcbus1?: number;
    singlegate?: boolean;
    td?: boolean;
    syncdelay?: boolean;
    fbOcc: string;
    ctcbusled1?: number;
    ctcbusled2?: number;
    fbusefield?: boolean;
    accnr?: number;
    operable?: boolean;
    bus?: number;
    fbRinv?: boolean;
    ctcaddrled2?: number;
    ctcaddrled1?: number;
    fb2Rinv?: boolean;
    dir?: boolean;
    port1?: number;
    port2?: number;
    outoforder?: boolean;
    fbGinv?: boolean;
    frogtimer?: number;
    gate0pol2?: number;
    gate0pol1?: number;
    fb2Ginv?: boolean;
    swtype: string;
    accessoryctrl: Accessoryctrl;
    frogporttype?: number;
    addr1pol1?: number;
    port1pol1?: number;
    addr1pol2?: number;
    port1pol2?: number;
    prev_id: string;
    frogiid: string;
    staticuse?: boolean;
    ctcflip2?: boolean;
    ctciidled1: string;
    ctcflip1?: boolean;
    ctciidled2: string;
    desc: string;
    uidname: string;
    tdaddr?: number;
    nr?: number;
    show?: boolean;
    rectcrossing?: boolean;
    actdelay?: boolean;
    blockid: string;
    subtype: string;
    ctciid1: string;
    addr2?: number;
    swapstraight?: boolean;
    ctccmdon2?: boolean;
    fbset?: boolean;
    ctccmdon1?: boolean;
    param1?: number;
    param2?: number;
    inv?: boolean;
    accessory?: boolean;
    locid: string;
}

export interface Swlist {
    sw: Sw[];
}

export interface Fb {
    regval: number;
    gpssid: number;
    blockid: string;
    maxload: number;
    pre_move_y: number;
    shortcut: boolean;
    pre_move_x: number;
    load: number;
    id: string;
    state: boolean;
    wheelcount: number;
    addr: number;
    pre_move_z: number;
    routeids: string;
    countedcars: number;
    val: number;
    identifier: string;
    offset: string;
    counter: number;
    baseaddr: number;
    x: number;
    y: number;
    z: number;
    carcount: number;
    locid: string;
    ori: string;
    bididir?: number;
    accnr?: number;
    operable?: boolean;
    bus?: number;
    ignoresamestate?: boolean;
    ctcasswitch?: boolean;
    reg5?: number;
    road?: boolean;
    reg4?: number;
    reg7?: number;
    reg6?: number;
    ctcaddr?: number;
    gpsz?: number;
    reg1?: number;
    reg0?: number;
    reg3?: number;
    reg2?: number;
    decid: string;
    prev_id: string;
    ctcport?: number;
    gpstolz?: number;
    gpstoly?: number;
    gpstolx?: number;
    activelow?: boolean;
    gpsx?: number;
    desc: string;
    resetwc?: boolean;
    gpsy?: number;
    uidname: string;
    ctcgate?: number;
    curve?: boolean;
    iid: string;
    zerocodedelay?: number;
    show?: boolean;
    timer?: number;
    fbtype?: number;
    cutoutbus?: number;
    ctciid: string;
    cutoutaddr?: number;
}

export interface Fblist {
    fb: Fb[];
}

export interface Plan {
    lightctrl: Lightctrl;
    lclist: Lclist;
    donkey: boolean;
    rocrailos: string;
    sglist: Sglist;
    rocrailip: string;
    remark: string;
    competition: string;
    title: string;
    stlist: Stlist;
    vrlist: Vrlist;
    boosterlist: string;
    healthy: boolean;
    bklist: Bklist;
    rocrailversion: string;
    rocguiversion: string;
    zlevel: Zlevel;
    tklist: Tklist;
    txlist: Txlist;
    rocrailpwd: string;
    swlist: Swlist;
    fblist: Fblist;
}

export interface Clock {
    wday: number;
    temp: number;
    hour: number;
    month: number;
    divider: number;
    year: number;
    bri: number;
    time: number;
    cmd: string;
    mday: number;
    minute: number;
}

export interface Exception {
    level: number;
    text: string;
    id: number;
}

export interface State {
    needkey4loconet: boolean;
    sensorbus: boolean;
    healthy: boolean;
    enablecom: boolean;
    power: boolean;
    accessorybus: boolean;
    programming: boolean;
    automode: boolean;
    trackbus: boolean;
    temp: number;
    consolemode: boolean;
    iid: string;
    error: number;
    loadmax: number;
    uid: number;
    load: number;
    volt: number;
}
export interface Fn {
    blockenterid: string;
    server: string;
    blockenterside: boolean;
    destblockid: string;
    fn: boolean;
    V_realkmh: number;
    dir: boolean;
    manual: boolean;
    mtime: number;
    resumeauto: boolean;
    placing: boolean;
    consist: string;
    mode: string;
    blockid: string;
    scheduleinithour: number;
    mint: number;
    len: number;
    rdate: number;
    V: number;
    id: string;
    addr: number;
    trainlen: number;
    trainweight: number;
    train: string;
    image: string;
    secaddr: number;
    modereason: string;
    runtime: number;
    active: boolean;
    weight: number;
    imagenr: number;
    waittime: number;
    scidx: number;
    pause: boolean;
    energypercentage: number;
    throttleid: string;
    fifotop: boolean;
    tourid: string;
    lookupschedule: boolean;
    scheduleid: string;
    f30: boolean;
    f10: boolean;
    f32: boolean;
    f31: boolean;
    f12: boolean;
    f11: boolean;
    f14: boolean;
    f13: boolean;
    f0: boolean;
        f16: boolean;
        f1: boolean;
        f15: boolean;
        f2: boolean;
        f18: boolean;
        f3: boolean;
        f17: boolean;
        f4: boolean;
        f5: boolean;
        f19: boolean;
        f6: boolean;
        f7: boolean;
        f8: boolean;
        f9: boolean;
        group: number;
        f21: boolean;
        f20: boolean;
        f23: boolean;
        f22: boolean;
        f25: boolean;
        f24: boolean;
        f27: boolean;
        f26: boolean;
        f29: boolean;
        f28: boolean;
        fncnt: number;
        fnchanged: number;
}

export interface RocrailEventFn {
    fn: Fn;
}

export interface RocrailEventPlan {
    plan: Plan;
}

export interface RocrailEventLc {
    lc: Lc;
}

export interface RocrailEventAuto {
    auto: Auto;
} 

export interface RocrailEventClock {
    clock: Clock;
}

export interface RocrailEventException {
    exception: Exception;
}

export interface RocrailEventState {
    state: State;
}
