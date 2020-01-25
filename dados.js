function formataData(timestamp){
  var data = new Date(timestamp);
  var dia = data.getDate();
  var mes = data.getMonth()+1;
  var ano = data.getFullYear();

  if(dia.toString().length == 1) dia = '0'+dia;
  if(mes.toString().length == 1) mes = '0'+mes;

  // return dia+'/'+mes+'/'+ano;
  return `${data.getDate()}/${data.getMonth()+1}/${data.getFullYear()}`
}

console.log(formataData());