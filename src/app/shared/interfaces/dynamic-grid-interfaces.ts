export interface IColumns {
    getValue(item: any): string;
    field: string,
    header: string,
    isSortable?: boolean,
    isFilter?: boolean,
    isAction?: boolean,
    onClick?: Function,
    visible?: boolean,
}