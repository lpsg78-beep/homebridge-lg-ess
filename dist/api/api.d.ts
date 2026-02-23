import { GRAPH_DEVICE, GRAPH_TIMESPAN, GraphBattItem, GraphLoadItem, GraphPVItem, GraphResponse, ISeetingSysteminfoResponseData, ISettingBatteryResponseData, ISettingCommonResponseData, ISettingHomeResponseData, ISettingNetworkResponseData } from './types';
export * from './types';
export declare class LgEssApi {
    private client;
    private authKey?;
    paths: {
        battery: string;
        common: string;
        graph: string;
        home: string;
        info: string;
        login: string;
        network: string;
        system: string;
    };
    constructor(ipOrHostname: string);
    login(password: string): Promise<this>;
    state<T>(type: keyof typeof this.paths): Promise<import("axios").AxiosResponse<T, any, {}>>;
    battery(): Promise<import("axios").AxiosResponse<ISettingBatteryResponseData, any, {}>>;
    home(): Promise<import("axios").AxiosResponse<ISettingHomeResponseData, any, {}>>;
    common(): Promise<import("axios").AxiosResponse<ISettingCommonResponseData, any, {}>>;
    network(): Promise<import("axios").AxiosResponse<ISettingNetworkResponseData, any, {}>>;
    system(): Promise<import("axios").AxiosResponse<ISeetingSysteminfoResponseData, any, {}>>;
    private postWithAuth;
    range(device: GRAPH_DEVICE, start: Date, end: Date): Promise<(GraphPVItem | GraphBattItem | GraphLoadItem)[]>;
    graph(device: GRAPH_DEVICE, timespan: GRAPH_TIMESPAN, date?: Date): Promise<import("axios").AxiosResponse<GraphResponse, any, {}>>;
    private parseGraphItem;
    private strToDate;
}
//# sourceMappingURL=api.d.ts.map