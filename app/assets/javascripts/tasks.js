$(document).ready (function () {

	tasks = [];

	var display_task = function (task) {
		$('#tasks_' + task.id).remove();
		console.log('help!!!!!!!');

		var $li = $('<li/>').attr('id', 'task_' + task.id);
		var $span1 = $('<span/>').addClass('title')
		var $span2 = $('<span/>').addClass('id invisible')
		var $span3 = $('<span/>').addClass('description invisible')
		var $span4 = $('<span/>').addClass('duedate invisible')
		var $span5 = $('<span/>').addClass('is_complete invisible')
		var $span6 = $('<span/>').addClass('address invisible')
		
		$span1.text(task.title);
		$span2.text(task.id);
		$span3.text(task.description);
		$span4.text(task.duedate);
		$span5.text(task.is_complete);
		$span6.text(task.address);

		$li.append([$span1, $span2, $span3, $span4, $span5, $span6]);
		$('#tasks').append($li);

		toggle_form();
	};

	var add_task_everywhere = function (task) {
		//task.title
		// This might be an update, so remove the old task if it's in the array.
		tasks = _.reject(tasks, function (p) {
		 return p.id === task.id;
		 });
		 // Now add/re-add.
		tasks.push(task);
		 // Sort by value, high to low.
		tasks = _.sortBy(tasks, function (p) { 
		 	return p.duedate;
		}).reverse();
		// Redraw all the entries.
		$('#tasks').empty();
		debugger;
		_.each(tasks, display_task);
	};


	var create_task = function () {
		var title = $('#title').val();
		var description = $('#description').val();
		var duedate = $('#duedate').val();
		var is_complete = $('#is_complete').is(':checked')
		var address = $('#address').val();
		var priority_id = $('#priority_id').val();
		var task_id = $('#task_id').val();
		var token = $('input[name="authenticity_token"]').val();

	$.ajax ({
		dataType: 'json',
		type: 'POST',
		url: '/tasks',
		data: {'authenticity_token': token, 'id': task_id, 'title': title, 'address': address, 'priority_id': priority_id, 'is_complete': is_complete, 'duedate': duedate, 'description': description}
	}).done(add_task_everywhere).error(function() {
		alert('nay');
	});	
		return false;
	};

	var update_task = function () {
		var title = $('#title').val();
		var description = $('#description').val();
		var duedate = $('#duedate').val();
		var is_complete = $('#is_complete').is(':checked')
		var address = $('#address').val();
		var priority_id = $('#priority_id').val();
		var task_id = $('#task_id').val();
		var token = $('input[name="authenticity_token"]').val();

		$.ajax ({
		dataType: 'json',
		type: 'POST',
		url: '/tasks',
		data: {'_method': 'put', 'authenticity_token': token, 'id': task_id, 'title': title, 'address': address, 'priority_id': priority_id, 'is_complete': is_complete, 'duedate': duedate, 'description': description}
	}).done(add_task_everywhere);	
		return false;
	};

	var edit_task = function () {
		if ($('.taskform').is(':hidden')) {
			toggle_form();
		}


		$('#create_task').hide();
		$('#update_task').show();

		var title = $(this).find('.title').text();
		var description = $(this).find('.description').text();
		var duedate = $(this).find('.duedate').text();
		var is_complete = $(this).find('.is_complete input').is(':checked');
		var address = $(this).find('.address').text();
		var priority_id = $(this).find('.priority_id').text();
		var id = $(this).find('.task_id').text();

		
		$('#title').val(title);
		$('#description').val(description);
		$('#duedate').val(duedate);
		if (is_complete) {
			$('#is_complete').attr('checked', true);
		};
		$('#address').val(address);
		$('#priority_id').val(priority_id);
	};


	var new_task = function () {
		if ($('.taskform').is(':hidden')) {
			toggle_form();
		};
			$('#create_task').show();
			$('#edit_task').hide();
		
	};


	var toggle_form = function () {
		$('.taskform').toggleClass('invisible');
		return false;
	};


	$('#new_task').click(new_task);
	$('#create_task').click(create_task);
	$('#cancel_task').click(toggle_form);
	$('#update_task').click(update_task);
	$('#tasks').on('click', '.editme', edit_task);
});