$(document).ready(function() {
    /* POST PRODUCTS FROM DATABASE */
    $.get('http://localhost:3000/phones', function(data) {
         $.each(data, function(key) {
            $('#employeeInput').before('<tr class="products"><td><img src="'+ data[key].image +  '"></td>' +
                                       '<td class="brand">' + data[key].brand + '</td>' +
                                       '<td class="model">' + data[key].model + '</td>' +
                                       '<td class="os">' + data[key].os + '</td>' +
                                       '<td class="screensize">' + data[key].screensize + '</td><td class="buttons" style="background-color: black"><button type="button" id='+ data[key].id +' class="editButton">Edit</button><button type="button" id='+ data[key].id +' class="saveButton">Save</button><button type="button" id='+ data[key].id +' class="deleteButton">Delete</button></td></tr>');
        }); 
    }); 
    
    /* SUBMIT AND POST NEW INPUT */
    var submitButton = $("#submitInput");
    submitButton.click(function() {
        
    $.post('http://localhost:3000/phones', $('#submitForm').serialize());

    setTimeout(function(){
        $.get("http://localhost:3000/phones", function(data, status){
            $('#employeeInput').before('<tr class="products"><td><img src="'+ data[data.length-1].image + '"></td>' +
                                   '<td class="brand">' + data[data.length-1].brand + '</td>' +
                                   '<td class="model">' + data[data.length-1].model + '</td>' +
                                   '<td class="os">' + data[data.length-1].os + '</td>' +
                                   '<td class="screensize">' + data[data.length-1].screensize + '</td><td class="buttons" style="background-color: black"><button type="button" id='+ data[data.length-1].id +' class="editButton">Edit</button><button type="button" id='+ data[data.length-1].id +' class="saveButton">Save</button><button type="button" id='+ data[data.length-1].id +' class="deleteButton">Delete</button></td></tr>');
        }, "json");
        $('#employeeInput input').val('');
    }, 20);
    });
    
    var resetButton = $("#resetButton");
    resetButton.click(function() {
        $.ajax({
                url: 'http://localhost:3000/reset',
                method: 'DELETE',
                contentType: 'application/json',
                success: function(response) {
                    console.log(response);
                }
            });
        $(".products").remove();
    });
    
    /* EDIT OR DELETE */
    
    $(document).on('click', '.deleteButton', function(){ 
        var id = this.id;
        $.ajax({
                url: 'http://localhost:3000/phones/delete/' + $(this).attr("id"),
                method: 'DELETE',
                contentType: 'application/json',
                success: function(response) {
                    console.log(response);
                }
            });
        $(this).closest(".products").remove();
    });
    
    $(document).on('click', '.editButton', function() { 
        var image = $(this).closest('.products').find("img").attr("src");
        $($(this).closest('.products').find("img")).replaceWith("<input class='imgInput' value='" + image + "' />");
        
        var brand = $(this).closest('.products').find(".brand").text();
        $(this).closest('.products').find(".brand").text("");
        $($(this).closest('.products').find(".brand")).append("<input class='brandInput' value='" + brand + "'>"); 
        
        var model = $(this).closest('.products').find(".model").text();
        $(this).closest('.products').find(".model").text("");
        $($(this).closest('.products').find(".model")).append("<input class='modelInput' value='" + model + "'>");
        
        var os = $(this).closest('.products').find(".os").text();
        $(this).closest('.products').find(".os").text("");
        $($(this).closest('.products').find(".os")).append("<input class='osInput' value='" + os + "'>");
        
        var screensize = $(this).closest('.products').find(".screensize").text();
        $(this).closest('.products').find(".screensize").text("");
        $($(this).closest('.products').find(".screensize")).append("<input class='screenInput'value='" + screensize + "'>");
          
        $(this).addClass("editClick");
        $(this).closest('.products').find('.saveButton').css("display", "inline-block");
        $(this).prop('disabled', true);
        
        $(document).on('click', '.saveButton', function() { 
            var newImage = $(this).closest('.products').find(".imgInput").val();
            var newBrand = $(this).closest('.products').find(".brandInput").val();
            var newModel = $(this).closest('.products').find(".modelInput").val();
            var newOs = $(this).closest('.products').find(".osInput").val();
            var newScreensize = $(this).closest('.products').find(".screenInput").val();

            var obj = $.parseJSON( '{ "brand": "'+ newBrand +'", "model": "'+ newModel +'", "os": "'+ newOs +'", "image": "'+ newImage +'", "screensize": "'+ newScreensize +'"}' ); 
            
             $(this).css("display", "none");
             $($(this).closest('.products').find(".imgInput")).replaceWith("<img src='" + newImage + "' />");
             $($(this).closest('.products').find('.brand').replaceWith("<td class='brand'>" + newBrand + "</td>"));
             $($(this).closest('.products').find('.model').replaceWith("<td class='model'>" + newModel + "</td>"));
             $($(this).closest('.products').find('.os').replaceWith("<td class='os'>" + newOs + "</td>"));
             $($(this).closest('.products').find('.screensize').replaceWith("<td class='screensize'>" + newScreensize + "</td>"));
            
            $.ajax({
                url: 'http://localhost:3000/phones/' + $(this).attr("id"),
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(obj),
                success: function(response) {
                    console.log(response);
                }
            });
            location.reload();
        });
    });
     
    /* SORTING TABLE */ 
    function sort($list, myClass, table) {
        var i, j, k = 0
        for (i=0; i < $list.length; i++) {
            for (j=0, k = $list.length-i; j < k; j++) {
                var $productOne = $(myClass + ':eq('+ j + ')'); 
                var $productTwo = $(myClass + ':eq('+ (j+1) + ')');
                
                var $first, $second;
                
                if ($.isNumeric($productOne.text()) && $.isNumeric($productTwo.text())) {
                    $first = parseInt($productOne.text());
                    $second = parseInt($productTwo.text());
                }
                else {
                    $first = $productOne.text().toUpperCase();
                    $second = $productTwo.text().toUpperCase();
                }
                
                if ($first > $second) {
                    $(table +':eq('+ j + ')').before($(table +':eq('+ (j+1) + ')'));

                    var $b = $productOne;
                    $productOne = $productTwo;
                    $productTwo = $b;
                }
            } 
        }
    }
    
    /* SORT PRODUCTS TABLE */ 
     
    var brandHeader = $("#brandHeader");
    brandHeader.click(function() {
        var $brandList = $('.brand');
        sort($brandList, '.brand', ".products");
    });
    
    var modelHeader = $("#modelHeader");
    modelHeader.click(function() {
        var $modelList = $('.model');
        sort($modelList, '.model', ".products");
    });
     
    var osHeader = $("#osHeader");
    osHeader.click(function() {
        var $osList = $('.os');
        sort($osList, '.os', ".products");
    });
     
    var sizeHeader = $("#sizeHeader");
    sizeHeader.click(function() {
        var $sizeList = $('.screensize');
        sort($sizeList, '.screensize', ".products");
    });
    
    /* SORTING PRIZES TABLE */
    
    var prizeName = $("#prizeName");
    prizeName.click(function() {
        var $nameList = $('.name');
        sort($nameList, '.name', ".prizes");
    });
    
    var prizeWinners = $("#prizeWinners");
    prizeWinners.click(function() {
        var $winnersList = $('.winners');
        sort($winnersList, '.winners', ".prizes");
    });
});