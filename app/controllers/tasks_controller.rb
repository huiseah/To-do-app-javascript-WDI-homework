class TasksController < ApplicationController
  before_filter :ensure_logged_in

  def index
    @tasks = @auth.tasks
  end

  def create
  	title = params[:title]
  	description = params[:description]
  	duedate = params[:duedate]
  	is_complete = params[:is_complete]
  	address = params[:address]
  	priority_id = params[:priority_id]

  	task = Task.create(:title => title, :description => description, :duedate => duedate, :is_complete => is_complete, :address => address, :priority_id => priority_id)
  	@auth.tasks << task

  	render :json => task
  end

  def update
  	id = params[:id]

  	task = Task.find(id)
  	task.update_attributes(params[:task])

  	render :json => task
  end

end