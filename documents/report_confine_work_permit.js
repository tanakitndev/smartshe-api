module.exports = ({
  name,
  position,
  job_member,
  performers,
  helpers,
  conservators,
  description,
  location_name,
  created_at,
  department_name,
  verify,
  questions,
  notices,
  protections
}) => {
  const today = new Date();
  const arrs = [100, 200, 300];

  var newArr = "";

  function show(arrs) {
    for (var i in arrs) {
      newArr += `
         <tr class="item">
            <td>Second item:</td>
            <td>${arrs[i]}$</td>
         </tr>
         `;
    }
  }
  show(arrs);

  var newArrPerformers = "";
  function loopPerformers() {
   for (var i in helpers) {
      newArrPerformers += `
            <tr>
               <td>1. ชื่อ-สกุล: ${performers[i]['name']}</td>
               <td>เลขที่วุฒิบัตร: ${performers[i]['certificate_no']}</td>
            </tr>
         `;
    }
  }
  loopPerformers();

  var newArrHelpers = "";
  function loopHelpers() {
   for (var i in helpers) {
      newArrHelpers += `
            <tr>
               <td>ผู้ช่วยเหลือ คือ: ${helpers.length ? helpers[i]['name']: 'NULL'}</td>
               <td>เลขที่วุฒิบัตร: ${helpers.length ? helpers[i]['certificate_no']: 'NULL'}</td>
            </tr>
         `;
    }
  }
  loopHelpers();
  
  var newArrConservators = "";
  function loopConservators() {
     if(conservators.length){
      for (var i in conservators) {
         newArrConservators += `
            <tr>
               <td>โดยมีผู้ควบคุมงาน คือ: ${conservators.length ? conservators[i]['name']: 'NULL'}</td>
               <td>เลขที่วุฒิบัตร: ${conservators.length ? conservators[i]['certificate_no']: 'NULL'}</td>
            </tr>
            `;
       }
     }else {
      newArrConservators = `
      <tr>
         <td>โดยมีผู้ควบคุมงาน คือ: </td>
         <td>เลขที่วุฒิบัตร: </td>
      </tr>
      `;
     }
   
  }
  loopConservators();

  var strQuestionA = "";
  var strQuestionB = "";
  function questionLoop() {
     var newQuestionA = questions.filter(el => {
        return el.work_permit_confine_type_id == "1";
     })
     var newQuestionB = questions.filter(el => {
        return el.work_permit_confine_type_id == "2";
     })
     for (var i in newQuestionA) {
        strQuestionA += `
            <tr>
               <td>${parseInt(i)+1}. ${newQuestionA[i]['work_permit_question_title']}</td>
               <td>${newQuestionA[i].value == "1" ? "ถูกต้อง": "ไม่เกี่ยวข้อง"}</td>
            </tr>
        `
     }
     for (var i in newQuestionB) {
      strQuestionB += `
          <tr>
             <td>${parseInt(i)+1}. ${newQuestionB[i]['work_permit_question_title']}</td>
             <td>${newQuestionB[i].value == "1" ? "ถูกต้อง": "ไม่เกี่ยวข้อง"}</td>
          </tr>
      `
   }
  }
  questionLoop();

  var strNotices = "";
  function noticesLoop() {
     for (var i in notices) {
      strNotices += `
            <tr>
               <td>${parseInt(i)+1}.${notices[i]['title']}</td>
            </tr>
      `;
     }
  }
  noticesLoop();

  var strProtections = "";
  function protectionsLoop() {
     for (var i in protections) {
      strProtections += `
            <tr>
               <td>${parseInt(i)+1}.${protections[i]['title']}</td>
            </tr>
      `;
     }
  }
  protectionsLoop();
  return `
  <!doctype html>
  <html>
     <head>
        <meta charset="utf-8">
        <title>PDF Result Template</title>
        <style>
           .invoice-box {
           max-width: 800px;
           margin: auto;
           padding: 30px;
           border: 1px solid #eee;
           box-shadow: 0 0 10px rgba(0, 0, 0, .15);
           font-size: 10px;
           line-height: 22px;
           font-family: 'Helvetica Neue', 'Helvetica',
           color: #555;
           }
           .justify-center {
           text-align: center;
           }
           .invoice-box table {
           width: 100%;
           line-height: inherit;
           text-align: left;
           }
           .invoice-box table td {
           padding: 0px;
           vertical-align: top;
           }
           .invoice-box table tr td{
           font-size: 10px;
           }
           @media only screen and (max-width: 600px) {
           .invoice-box table tr.top table td {
           width: 100%;
           display: block;
           text-align: center;
           }
           .invoice-box table tr.information table td {
           width: 100%;
           display: block;
           text-align: center;
           }
           }
           .text-right-header {
               font-size: 10px;
           }
           .text-right-header-second {
              margin-top: 14px;
              font-size: 10px;
              text-align: center;
           }
           .text-right-header-second-value {
              font-size: 10px;
              text-align: center;
              border-bottom: 1px solid #000;
           }
           .border-box{
               border: 1px solid #000;
               text-align: center;
               padding: 5px;
           }
           .title {
               font-size: 12px;
               font-weight: bold;
           }
           .title-second {
               margin-top: 0px;
           }
           .text-left {
              text-align: left;
           }
           td {
              padding: 0 !important;
              margin: 0 !important;
           }
           .text {
              font-size: 10px;
           }
        </style>
     </head>
     <body>
        <div class="invoice-box">
   <div class="border-box">
     <table>
        <tr>
           <td colspan="2">
              <table>
                 <tr>
                    <td rowspan="2" class="title"><img  src="http://ptfwebsite.ddns.net/logo.png"
                       style="width:100%; max-width:90px;"></td>
                    <td >
                        <div class="justify-center title">บริษัท ซีพีเอฟ (ประเทศไทย) จำกัด (มหาชน)</div>
                        <div class="justify-center title">โรงงานผลิตอาหารสัตว์ปักธงชัย</div>
  
                        <br>
                        <div class="justify-center border title title-second">แบบขออนุญาตให้ปฏิบัติงานในที่อับอากาศ</div>
                     </td>
                    <td>
                        <div class="text-right-header border-box">เอกสารควบคุม: SF-SF-022</div>
  
                        <div class="text-right-header-second">ผู้จ่ายใบอนุญาต</div>
                        <div class="text-right-header-second-value">&nbsp;</div>
                    </td>
                 </tr>
              </table>
           </td>
        </tr>
  
        
        <tr>
           <td>
              <div>
                 <div>ชื่อผู้ขออนุญาตข้าพเจ้า: ${name}</div>
                 <div>ตำแหน่ง: ${position}</div>
                 <div>ขออนุญาตให้ผู้มีรายชื่อดังต่อไปนี้: ${job_member} คน คือ</div>
             </div>
           </td>
           <td>
              <div>
                 <div>วันที่ยื่นใบขออนุญาต: ${created_at.split('T')[0]}</div>
                 <div>หน่วยงาน/สังกัด: ${department_name}</div>
              </div>
           </td>
        </tr>
  
        <tr>
           <td >
              <table>
                 ${newArrPerformers}
              </table>
           </td>
        </tr>
  
        <tr>
           <td>
              <div>เข้าปฏิบัติงานเกี่ยวกับ: ${description}</div>
              <div>วันที่ปฏิบัติงาน: ${created_at.split("T")[0]}</div>
           </td>
           <td>
              <div>สถานที่ปฏิบัติงาน: ${location_name}</div>
              <div>เริ่มเวลา: 08:00 ถึงเวลา: 17:00</div>
           </td>
        </tr>
  
        <tr>
           <td>
              <table>
              ${newArrConservators}
              </table>
           </td>
           <td>
              <table>
                 ${newArrHelpers}
              </table>
           </td>
        </tr>
  
       
     </table>
  
     <div style="font-size: 10px; text-align: left;">ผลการตรวจปริมาณสารเคมี</div>
     <div style="font-size: 10px; text-align: left;">1. ออกซิเจน = ${verify['oxygen']} % (ต้องอยู่ระหว่าง 19.5 - 23.5)</div>
     <div style="font-size: 10px; text-align: left;">2. สารไวไฟ &nbsp;= ${verify['gas']} % (ต้องไม่เกิน 10%LEL)</div>
     <div style="font-size: 10px; text-align: left;">3. H2S &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= ${verify['h2s']} ppm (ต้องไม่เกิน 0 ppm)</div>
     <div style="font-size: 10px; text-align: left;">4. CO &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= ${verify['co']} ppm (ต้องไม่เกิน 0 ppm)</div>
  
     <table>
        <tr>
           <th style="width: 50%; font-size: 10px; font-weight: 100; text-align: center;">มาตรการความปลอดภัยที่เตรียมไว้ก่อนการให้ลูกจ้างเข้าไปทำงาน</th>
           <th style="width: 50%; font-size: 10px; font-weight: 100; text-align: center;">อุปกรณ์คุ้มครองความปลอดภัยส่วนบุคคลและอุปกรณ์ช่วยเหลือและช่วยชีวิตที่ต้องใช้</th>
        </tr>
        <tr>
           <td>
              <table>
                 ${strQuestionA}
              </table>
           </td>
           <td>
              <table>
                 ${strQuestionB}
              </table>
           </td>
        </tr>
     </table>
  
     <div>
        <table>
           <tr>
              <td>
                 <div>อันตรายที่ลูกจ้างอาจได้รับในกรณีฉุกเฉิน</div>
                 <div>
                    <table>
                      ${strNotices}
                    </table>
                 </div>
              </td>
              <td>
                 <div>วิธีการหลีกหนีภัยและป้องกัน</div>
                 <div>
                    <table>
                       ${strProtections}
                    </table>
                 </div>
              </td>
              <td>
                 <div class="justify-center">ตรวจสอบระหว่างปฏิบัติงาน</div>
                 <div class="justify-center" style="padding-top: 40px;">ลงชื่อ............................................</div>
                 <div class="justify-center">เจ้าหน้าที่ความปลอดภัยฯ</div>
              </td>
           </tr>
        </table>
     </div>
  
     <div>
        <div class="text-left text">บริษัท เจริญโภคภัณฑ์อีสาน จำกัด (มหาชน) อนุญาตให้ ${name} และผู้ปฏิบัติงาน</div>
        <div class="text-left text">จำนวน............คน ตามรายชื่อข้างต้นลำดับที่ .............. เข้าปฏิบัติงานพร้อมทั้งผู้ควบคุมงาน และผู้ช่วยเหลือ ปฏิบัติงาน ตามวัน เวลา และสถานที่ดังกล่าวได้</div>
        <div class="text-left text">ด้วยภาระกิจตามที่กฏหมายกำหนด</div>
        <div class="text">ออกให้ ณ วันที่ ...............................................</div>
        <div class="text">(ลงชื่อ) .....................................................</div>
        <div class="text">(&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)</div>
        <div class="text">ผู้มีหน้าที่รับผิดชอบในการอนุญาต</div>
     </div>
   </div>
           <table>
              <tr>
                 <td style="width:50px;">
                    <div style="font-size: 8px;" style="text-decoration: underline;">หมายเหตุ</div>
                 </td>
                 <td>
                    <div style="font-size: 8px;">1.แบบขออนุญาตนี้มีกำหนดเวลาที 8 ชั่วโมงวันทำงานปกติ หากเกินจากนี้ให้ดำเนินการขออนุญาตใหม่</div>
                    <div style="font-size: 8px;">2.ผู้ควบคุม ผู้ช่วยเหลือ และผู้ปฏิบัติงาน ในที่อับอากาศ ต้องผ่านการอบรมจากเจ้าหน้าที่ความปลอดภัยวิชาชีพ ในหลักสูตร อันตรายจากการทำงานที่อับอากาศ ก่อนทุกครั้ง</div>
                    <div style="font-size: 8px;">3.เมื่อเสร็จงานให้ผู้ปฏิบัติงานนำแบบขออนุญาตนี้ ส่งให้กับผู้ควบคุมงาน เพื่อทำการตรวจสอบความเรียบร้อยต่อไป และเมื่อผู้ควบคุมงาน ตรวจพื้นที่แล้วให้นำใบอนุญาตส่งคืน รปภ. โดยทันที</div>
                 </td>
              </tr>
           </table>
  
           <table>
              <tr>
                 <td style="width:500px;"></td>
                 <td>
                    <div style="font-size: 8px;">ฉบับที่ 1 สำหรับขออนุญาต/ผู้ควบคุม/ผู้ช่วยเหลือ/ผู้ปฏิบัติงาน</div>
                    <div style="font-size: 8px;">ฉบับที่ 2 สำหรับ เจ้าหน้าที่ความปลอดภัย/ยามรักษาการณ์</div>
                 </td>
              </tr>
           </table>
          
        </div>
     </body>
  </html>
    `;
};
