export enum UserRoleEnum {
    Customer = 1,
    Manager = 2,
    Employee = 3,
    Admin = 4
}
export const getRoleName = (roleId: number): string => {
    switch (roleId) {
    case UserRoleEnum.Customer:
        return 'Khách hàng';
    case UserRoleEnum.Manager:
        return 'Quản lý';
    case UserRoleEnum.Employee:
        return 'Nhân viên';
    case UserRoleEnum.Admin:
        return 'Admin';
    default:
        return '';
    }
};
export enum GenderEnum {
    MALE = 0,
    FEMALE = 1
}
export const getGenderName = (gender: number): string => {
    switch (gender) {
    case GenderEnum.MALE:
        return 'Nam';
    case GenderEnum.FEMALE:
        return 'Nữ';
    default:
        return '';
    }
};