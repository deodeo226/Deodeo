import { Field } from "payload";

export const lichkham: Field = {
    name: 'lichkham',
    label: 'Lịch khám',
    type: 'relationship',
    relationTo: 'appointments',  // Kết nối đến bảng "appointments"
    hasMany: true,  // Một bệnh nhân có thể có nhiều lịch khám
};

export const ylenh: Field = {
    name: 'ylenh',
    label: 'Y Lệnh',
    type: 'relationship',
    relationTo: 'medicalorders', // Kết nối đến bảng medicalorders
    hasMany: true,  // Một bệnh nhân có thể có nhiều y lệnh
};