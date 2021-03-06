module.exports = ({
   questions,
   location_name,
   created_at
}) => {

   var engineerQuestions = questions.filter(el => {
      return el.approved_role === "engineer"
   });
   var ownerQuestions = questions.filter(el => {
      return el.approved_role === "owner"
   });

   var strQuestions = "";
   function loopQuestions() {
      for (var i in engineerQuestions) {
        strQuestions += `
        <tr>
            <td>
               <div style="margin-top: -6px;">${parseInt(i)+1}. ${engineerQuestions[i]['work_permit_question_title']}</div>
            </td>
            <td>
               <div style="margin-top: -6px;">${ownerQuestions[i]['value'] == "1" ? "ถูก": "ไม่เกี่ยว"}</div>
            </td>
            <td>
               <div style="margin-top: -6px;">${engineerQuestions[i]['value'] == "1" ? "ถูก": "ไม่เกี่ยว"}</div>
            </td>
         </tr>
        `
      }
   }
   loopQuestions();
  
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
           line-height: 21px;
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
  
        .border-box {
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
  
        .box {
           border: 1px solid #000;
           padding: 5px;
        }
  
        .checklist {
           display: inline-block;
           border: 1px solid #000;
           width: 10px;
           height: 10px;
        }
        #custom-table td {
           padding: 0 !important;
        }
     </style>
  </head>
  
  <body>
     <div class="invoice-box">
        <div class="border-box">
           <table>
              <tr>
                 <td colspan="3">
                    <table>
                       <tr>
                          <td rowspan="2" class="title"><img src="http://ptfwebsite.ddns.net/logo.png"
                                style="width:100%; max-width:70px;"></td>
                          <td>
                             <div class="justify-center" style="color: #d35400;">ธุรกิจผลิตอาหารสัตว์และการก่อสร้าง</div>
                             <div class="justify-center" style="color: #d35400; margin-top: -5px;">บริษัท ซีพีเอฟ (ประเทศไทย) จำกัด (มหาชน)
                                - โรงงานผลิตอาหารสัตว์ปักธงชัย</div>
                             <div class="justify-center">แบบขออนุญาตทำงานที่เกิดความร้อนและประกายไฟ</div>
                             <div class="justify-center" style="margin-top: -5px;">(HOT WORK PERMIT)</div>
                          </td>
                          <td>
                             <div class="text-right-header border-box">เอกสารควบคุม: SF-SF-021</div>
                             <div class="text-right-header-second">ผู้จ่ายใบอนุญาต</div>
                             <div class="text-right-header-second-value">&nbsp;</div>
                          </td>
                       </tr>
                    </table>
                 </td>
              </tr>
           </table>
  
           <table style="margin-top: -5px; margin-bottom: -5px;">
              <tr>
                 <td>
                    <div>
                       <div>ผู้ปฏิบัติงาน ส่งแบบขออนุญาต</div>
                       <div>
                          <table>
                             <tr>
                                <td style="width: 45px;">ฉบับนี้ต่อ:</td>
                                <td>
                                   <div>1. วิศวกรรม</div>
                                   <div>2. เจ้าของสถานที่</div>
                                   <div>3. ผู้จัดการโรงงาน</div>
                                </td>
                             </tr>
                          </table>
                       </div>
                    </div>
                 </td>
                 <td>
                    <div>
                       <div>วันที่ยื่นใบขออนุญาต: ${created_at.split("T")[0]}</div>
                       <div>วันที่ปฏิบัติงาน................... เวลา เริ่ม 08:00 ถึง 17.00 </div>
                       <div>บริเวณที่ปฏิบัติงาน ${location_name}</div>
                       <div>ลักษณะงานที่ทำ...............................................................</div>
                    </div>
                 </td>
                 <td>
                    <div style="padding-top: 20px;">
                       <div>ผู้จ่ายใบอนุญาต............................................................</div>
                       <div>ผู้ขออนุญาต...............................................................</div>
                    </div>
                 </td>
              </tr>
           </table>
  
  
           <table style="margin-top: -10px; margin-bottom: -10px;">
              <tr>
                 <td>
                    <table>
                       <tr>
                          <td>
                             <table id="custom-table">
                                <tr>
                                   <td>ข้อกำหนดในการตรวจสอบพื้นที่ก่อนลงนามอนุญาตให้ทำงาน</td>
                                   <td>เจ้าของสถานที่</td>
                                   <td>วิศวกรรม</td>
                                </tr>
  
                                ${strQuestions}
  
                             </table>
  
  
                             <div style="margin-top: -10px;">
                                <hr>
                                <div>ข้าพเจ้าเข้าใจงานที่ต้องปฏิบัติเป็นอย่างดี
                                   และจะปฏิบัติตามข้อกำหนดในข้างต้นตลอดเวลาที่ปฏิบัติงาน
                                   และหลังจากเสร็จงานจะทำการตรวจสอบสถานที่ทำงานและอุปกรณ์ต่างๆ ให้อยู่ในสภาพที่ปลอดภัย
                                </div>
                                <div>
                                   <div style="display: inline-block; width: 60%;"></div>
                                   <div style="display: inline-block; width: 39%; text-align: center;">
                                      <div>
                                         <div>...................................................</div>
                                         <div>ผู้ขออนุญาตและผู้ปฏิบัติหน้าที่</div>
                                      </div>
                                   </div>
                                </div>
                             </div>
  
                          </td>
                          <td style="width: 20%; text-align: center;">
                             <div>
                                <div>1. ผู้ตรวจพื้นที่และอนุญาต</div>
                                <div>..........................................</div>
                                <div>ฝ่าย/แผนกวิศวกรรม</div>
                             </div>
                             <div style="margin-top: 40px;">
                                <div>2. ผู้ตรวจพื้นที่และอนุญาต</div>
                                <div>..........................................</div>
                                <div>ฝ่าย/แผนกเจ้าของพื้นที่</div>
                             </div>
                             <div style="margin-top: 40px;">
                                <div>3. อนุมัติ</div>
                                <div>..........................................</div>
                                <div>ผู้จัดการโรงงาน</div>
                             </div>
                          </td>
                       </tr>
                    </table>
  
  
  
  
  
                    <hr>
  
                    <table style="margin-bottom: -5px; margin-top: -5px;">
                       <tr>
                          <td style="width: 80%;">
                             <div>
                                <div class="justify-center">การตรวจพื้นที่ระหว่างปฏิบัติงาน โดยเจ้าหน้าที่</div>
                                <div>
                                   <div class="checklist"></div> การปฏิบัติงานเป็นไปตามข้อกำหนดของการขออนุญาต เวลา
                                   ....................................
                                </div>
                                <div>
                                   <div class="checklist"></div> ไม่เป็นไปตามข้อกำหนด ในข้อที่
                                   ................................................................................
                                </div>
                                <div style="color: #d35400;">
                                   ให้หยุดการทำงานชั่วคราวเพื่อปรับปรุงแก้ไขการทำงาน และขออนุญาต
                                   ทำงานจากผู้จัดการโรงงานอีกครั้ง โดยฝ่ายวิศวกรรม
                                </div>
                             </div>
                          </td>
                          <td style="width: 20%;">
                             <div class="justify-center">
                                <div>ลงนามผู้ตรวจ</div>
                                <div style="margin-top: 30px;">..........................................</div>
                                <div style="margin-top: -5px;">เจ้าของพื้นที่</div>
                             </div>
                          </td>
                       </tr>
                    </table>
  
                    <hr>
  
  
                    <table style="margin-bottom: -5px; margin-top: -5px;">
                       <tr>
                          <td style="width: 80%;">
                             <div>
                                <div class="justify-center">การตรวจพื้นที่ระหว่างปฏิบัติงาน โดยเจ้าหน้าที่</div>
                                <div>
                                   <div class="checklist"></div> การปฏิบัติงานเป็นไปตามข้อกำหนดของการขออนุญาต เวลา
                                   ....................................
                                </div>
                                <div>
                                   <div class="checklist"></div> ไม่เป็นไปตามข้อกำหนด ในข้อที่
                                   ................................................................................
                                </div>
                                <div style="color: #d35400;">
                                   ให้หยุดการทำงานชั่วคราวเพื่อปรับปรุงแก้ไขการทำงาน และขออนุญาต
                                   ทำงานจากผู้จัดการโรงงานอีกครั้ง โดยฝ่ายวิศวกรรม
                                </div>
                             </div>
                          </td>
                          <td style="width: 20%;">
                             <div class="justify-center">
                                <div>ลงนามผู้ตรวจ</div>
                                <div style="margin-top: 30px;">..........................................</div>
                                <div style="margin-top: -5px;">จป.</div>
                             </div>
                          </td>
                       </tr>
                    </table>
  
                    <hr>
  
                    <table style="margin-bottom: -10px; margin-top: -5px;">
                       <tr>
                          <td style="width: 80%;">
                             <div>
                                <div>
                                   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ตามที่มีการให้หยุดงานชั่วคราวเนื่องจากระหว่างการทำงาน
                                   มีการกระทำผิดข้อกำหนดที่..........................................
                                </div>
                                <div>
                                   บัดนี้ ได้ทำการตรวจสอบแก้ไขปรับปรุง ให้เป็นไปตามข้อกำหนดเรียบร้อยแล้ว
                                   จึงขออนุญาตทำงานใหม่อีกครั้ง
                                   และจะตรวจสอบการทำงานอย่างเคร่งครัดเพื่อไม่ให้เกิดเหตุการณ์ดังกล่าวขึ้นอีก
                                </div>
  
                                <table style="margin-top: 10px;">
                                   <tr>
                                      <td>
                                         <div class="justify-center">
                                            .......................................................</div>
                                         <div class="justify-center">ผู้ปฏิบัติงาน</div>
                                      </td>
                                      <td>
                                         <div class="justify-center">
                                            .......................................................</div>
                                         <div class="justify-center">เจ้าของสถานที่</div>
                                      </td>
                                      <td>
                                         <div class="justify-center">
                                            .......................................................</div>
                                         <div class="justify-center">วิศวกรรม</div>
                                      </td>
                                   </tr>
                                </table>
                             </div>
                          </td>
                          <td style="width: 20%;">
                             <div class="justify-center" style="margin-top: 20px;">
                                <div>อนุมัติ ให้ทำงานได้</div>
                                <div style="margin-top: 30px;">..........................................</div>
                                <div>ผู้จัดการโรงงาน</div>
                             </div>
                          </td>
                       </tr>
                    </table>
  
                    <hr>
  
                    <table style="margin-bottom: -10px; margin-top: -5px;">
                       <tr>
                          <td style="width: 80%;">
                             <div>
                                <div>
                                   การตรวจหลังการปฏิบัติงานเสร็จทันที
                                </div>
                                <div>
                                   <div class="checklist" style="margin-right: 5px;"></div> สภาพเรียบร้อย
                                   <div class="checklist" style="margin-left: 20px; margin-right: 5px;"></div>
                                   สภาพไม่เรียบร้อยให้ดำเนินการแก้ โดย........................
                                </div>
                             </div>
                          </td>
                          <td style="width: 20%;">
                             <div class="justify-center">
                                <div style="margin-top: 10px;">..........................................</div>
                                <div style="margin-top: -10px;">เจ้าของสถานที่</div>
                             </div>
                          </td>
                       </tr>
                    </table>
  
                    <hr>
  
                    <table style="margin-bottom: -10px;">
                       <tr style="color: #d35400;">
                          <td style="width: 80%;">
                             <div>
                                <div>
                                   การตรวจหลังการปฏิบัติงานเสร็จไปแล้ว 60 นาที (ต้องมีการตรวจเฝ้าระวังและต่อเนื่องทุกๆ 30
                                   นาที อีก 3 ชั่วโมงเพื่อความมั่นใจ)
                                </div>
                                <table style="margin-top: -5px;">
                                   <tr>
                                      <td style="width: 70px;">60 นาทีแรก</td>
                                      <td>
                                         <div class="checklist" style="margin-right: 5px;"></div> สภาพเรียบร้อย
                                      </td>
                                      <td>
                                         <div class="checklist" style="margin-left: 20px; margin-right: 5px;"></div>
                                         สภาพไม่เรียบร้อยให้ดำเนินการแก้ โดย........................
                                      </td>
                                   </tr>
                                </table>
                             </div>
                          </td>
                          <td style="width: 20%;">
                             <div class="justify-center" style="margin-top: 10px;">
                                <div>..........................................</div>
                                <div style="margin-top: -10px;">เจ้าของสถานที่</div>
                             </div>
                          </td>
                       </tr>
                    </table>
  
                    <hr>
  
                    <table style="margin-bottom: -10px;">
                       <tr style="color: #d35400;">
                          <td style="width: 80%;">
                             <div>
                                <div>
                                   <table style="margin-top: -5px;">
                                      <tr>
                                         <td style="width: 70px;">30 นาทีแรก</td>
                                         <td>
                                            <div class="checklist" style="margin-right: 5px;"></div> สภาพเรียบร้อย
                                         </td>
                                         <td>
                                            <div class="checklist" style="margin-left: 20px; margin-right: 5px;"></div>
                                            สภาพไม่เรียบร้อยให้ดำเนินการแก้ โดย........................
                                         </td>
                                      </tr>
                                   </table>
                                   <table style="margin-top: -5px;">
                                      <tr>
                                         <td style="width: 70px;">1 ชม.</td>
                                         <td>
                                            <div class="checklist" style="margin-right: 5px;"></div> สภาพเรียบร้อย
                                         </td>
                                         <td>
                                            <div class="checklist" style="margin-left: 20px; margin-right: 5px;"></div>
                                            สภาพไม่เรียบร้อยให้ดำเนินการแก้ โดย........................
                                         </td>
                                      </tr>
                                   </table>
                                </div>
                             </div>
                          </td>
                          <td style="width: 20%;">
                             <div class="justify-center" style="margin-top: 5px;">
                                <div>..........................................</div>
                                <div style="margin-top: -10px;">เจ้าของสถานที่</div>
                             </div>
                          </td>
                       </tr>
                    </table>
  
                    <hr>
  
                    <table style="margin-bottom: -10px;">
                       <tr style="color: #d35400;">
                          <td style="width: 80%;">
                             <div>
                                <div>
                                   <table style="margin-top: -5px;">
                                      <tr>
                                         <td style="width: 70px;">1 ชม.30 นาที</td>
                                         <td>
                                            <div class="checklist" style="margin-right: 5px;"></div> สภาพเรียบร้อย
                                         </td>
                                         <td>
                                            <div class="checklist" style="margin-left: 20px; margin-right: 5px;"></div>
                                            สภาพไม่เรียบร้อยให้ดำเนินการแก้ โดย........................
                                         </td>
                                      </tr>
                                   </table>
                                   <table style="margin-top: -5px;">
                                      <tr>
                                         <td style="width: 70px;">2 ชม.</td>
                                         <td>
                                            <div class="checklist" style="margin-right: 5px;"></div> สภาพเรียบร้อย
                                         </td>
                                         <td>
                                            <div class="checklist" style="margin-left: 20px; margin-right: 5px;"></div>
                                            สภาพไม่เรียบร้อยให้ดำเนินการแก้ โดย........................
                                         </td>
                                      </tr>
                                   </table>
                                </div>
                             </div>
                          </td>
                          <td style="width: 20%;">
                             <div class="justify-center" style="margin-top: 5px;">
                                <div>..........................................</div>
                                <div style="margin-top: -10px;">เจ้าของสถานที่</div>
                             </div>
                          </td>
                       </tr>
                    </table>
  
                    <hr>
  
                    <table style="margin-bottom: -5px;">
                       <tr style="color: #d35400;">
                          <td style="width: 80%;">
                             <div>
                                <div>
                                   <table style="margin-top: -5px;">
                                      <tr>
                                         <td style="width: 70px;">2 ชม.30 นาที</td>
                                         <td>
                                            <div class="checklist" style="margin-right: 5px;"></div> สภาพเรียบร้อย
                                         </td>
                                         <td>
                                            <div class="checklist" style="margin-left: 20px; margin-right: 5px;"></div>
                                            สภาพไม่เรียบร้อยให้ดำเนินการแก้ โดย........................
                                         </td>
                                      </tr>
                                   </table>
                                   <table style="margin-top: -5px;">
                                      <tr>
                                         <td style="width: 70px;">3 ชม.</td>
                                         <td>
                                            <div class="checklist" style="margin-right: 5px;"></div> สภาพเรียบร้อย
                                         </td>
                                         <td>
                                            <div class="checklist" style="margin-left: 20px; margin-right: 5px;"></div>
                                            สภาพไม่เรียบร้อยให้ดำเนินการแก้ โดย........................
                                         </td>
                                      </tr>
                                   </table>
                                </div>
                             </div>
                          </td>
                          <td style="width: 20%;">
                             <div class="justify-center" style="margin-top: 5px;">
                                <div>..........................................</div>
                                <div style="margin-top: -10px;">เจ้าของสถานที่</div>
                             </div>
                          </td>
                       </tr>
                    </table>
  
                 </td>
              </tr>
           </table>
  
  
  
  
  
        </div><!-- End border box -->
        <table>
           <tr>
              <td style="width:50px;">
                 <div style="font-size: 8px;" style="text-decoration: underline;">หมายเหตุ</div>
              </td>
              <td>
                 <div style="font-size: 8px;">1.แบบขออนุญาตนี้มีกำหนดเวลาที 8 ชั่วโมงวันทำงานปกติ
                    หากเกินจากนี้ให้ดำเนินการขออนุญาตใหม่</div>
                 <div style="font-size: 8px;">2.เมื่อเสร็จงานให้ผู้ปฏิบัติงานนำแบบขออนุญาตนี้ ส่งให้กับผู้ควบคุมงาน
                    เพื่อทำการตรวจสอบความเรียบร้อยต่อไป และเมื่อผู้ควบคุมงาน ตรวจพื้นที่แล้วให้นำใบอนุญาตส่งคืน รปภ.
                    โดยทันที</div>
              </td>
           </tr>
        </table>
     </div>
  </body>
  
  </html>
    `;
};
