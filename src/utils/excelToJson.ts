import { useState } from 'react';
import * as xlsx from 'xlsx';
import * as XLSX from "xlsx";




export function excelToJson(file: File): Promise<Record<string, unknown[]>> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = xlsx.read(data, { type: 'array' });

            const jsonData: Record<string, unknown[]> = {};
            workbook.SheetNames.forEach(sheetName => {
                const worksheet = workbook.Sheets[sheetName];

                jsonData[sheetName] = xlsx.utils.sheet_to_json(worksheet
                    ,{
                    header: 1, // Read the data as an array of arrays (row-by-row)
                    defval: "", // Fill empty cells with an empty string
                    blankrows: false, // Skip completely blank rows
                  }
                
                );
            });

            resolve(jsonData);
            console.log(jsonData);
            
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
}


export function readJsonFile (){

}