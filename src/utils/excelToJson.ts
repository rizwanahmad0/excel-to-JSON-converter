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


// interface JsonData {
//     [key: string]: any; // Replace `any` with specific types based on your expected data structure
//   }

// export function xlsmToJson (f:any):  Promise<JSON|any> {
//     return new Promise((resolve, reject) => {

//    // const [jsonData, setJsonData] = useState<JsonData[]>([]);

//     const file = f

//     if (file) {
//       const reader = new FileReader();

//       reader.onload = (e: ProgressEvent<FileReader>) => {
//         if (e.target?.result) {
//           const data = new Uint8Array(e.target.result as ArrayBuffer);
//           const workbook: XLSX.WorkBook = XLSX.read(data, { type: "array" });

//           // Assuming the first sheet is the one we want
//           const sheetName: string = workbook.SheetNames[0];
//           const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

//           // Convert the worksheet to JSON
//           const json: JsonData[] = XLSX.utils.sheet_to_json(worksheet);
//          // setJsonData(json);
//           resolve(json)
//         }
//       };

//       reader.readAsArrayBuffer(file);
//     }
// });
// }