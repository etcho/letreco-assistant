$(document).ready(function () {
	let html = '';
	for (row = 1; row <= 6; row++) {
		html += '<tr id="row_' + row + '">';
		for (col = 1; col <= 5; col++) {
			html += '   <td class="col col_' + col + '" col="' + col + '"';
			html += '   </td>';
		}
		html += '   <td>';
		html += '       <input maxlength="5" class="word" type="text" row="' + row + '" id="word_' + row + '" placeholder="Palavra ' + row + '" />';
		html += '   </td>';
		html += '</tr>';
	}
	$("#letters tbody").html(html);
	$(".col").on("click", function () {
		cycleColor(this);
	});
	$("input.word").on("keyup", function () {
		typeWord(this);
	});
	$("#btn_filter").on("click", filter);
});

function cycleColor(cell) {
	if ($(cell).hasClass("green")) {
		$(cell).removeClass("green").addClass("yellow");
	} else if ($(cell).hasClass("yellow")) {
		$(cell).removeClass("yellow").addClass("red");
	} else if ($(cell).hasClass("red")) {
		$(cell).removeClass("red").addClass("white");
	} else {
		$(cell).addClass("green");
	}
}

function typeWord(input) {
	const text = $(input).val();
	const row = $(input).attr("row");
	for (let i = 1; i <= 5; i++) {
		$("#row_" + row + " .col_" + i).html(text.length >= i ? text[i - 1] : "");
	}
}

function filter() {
	let correct = {1: "", 2: "", 3: "", 4: "", 5: ""};
	let misplaced = { 1: [], 2: [], 3: [], 4: [], 5: [] };
	let all_misplaced_letters = [];
	let wrong = [];
	$(".col.green").each(function () {
		correct[$(this).attr("col")] = $(this).html().toUpperCase();
	});
	$(".col.yellow").each(function () {
		misplaced[$(this).attr("col")].push($(this).html().toUpperCase());
		all_misplaced_letters.push($(this).html().toUpperCase());
	});
	$(".col.red").each(function () {
		wrong.push($(this).html().toUpperCase());
	});
	let filtered_words = words.filter(function (value, index, arr) {
		//filtrando palavras com letras na posição correta
		for (let i = 1; i <= 5; i++) {
			if (correct[i] !== "") {
				if (value[i - 1] !== correct[i]) {
					return false;
				}
			}
		}
		return true;
	}).filter(function (value, index, arr) {
		//filtrando palavras com as letras que não existem
		for (let i = 0; i < wrong.length; i++) {
			let wrong_letter = wrong[i];
			if (value.indexOf(wrong_letter) !== -1) {
				return false;
			}
		}
		return true;
	}).filter(function (value, index, arr) {
		//filtrando palavras com letras amarelas na posição amarela
		for (let i = 1; i <= 5; i++) {
			let misplaced_words = misplaced[i];
			if (misplaced_words.length > 0) {
				if (misplaced_words.indexOf(value[i - 1]) !== -1) {
					return false;
				}
			}
		}
		return true;
	}).filter(function (value, index, arr) {
		//filtrando palavras que não possuem letras amarelas em nenhuma posição
		for (let i = 0; i < all_misplaced_letters.length; i++) {
			if (value.indexOf(all_misplaced_letters[i]) === -1) {
				return false;
			}
		}
		return true;
	});
	showFilteredWords(filtered_words);
}

function showFilteredWords(filtered_words) {
	let wrapper = $("#filtradas");
	wrapper.html("Palavras possíveis (" + filtered_words.length + "): <br />");
	$(filtered_words).each(function(a, palavra) {
		wrapper.append('<span>' + palavra + '</span>');
	});
}