class FocusesController < ApplicationController

  def create
    if logged_in? && current_user && current_user.usertype == "admin"
        @focus = Focus.new(focus_params)
        if @focus.save
            render json: {focus: @focus}, status: :created
        else
            if Focus.find_by(focus:params["focus"]["focus"]) != nil
                render json: {errors: ["this focus name already taken"]}, status: :internal_server_error
            elsif params["focus"]["focus"].nil?
                render json: {errors: ["focus name not provided"]}, status: :internal_server_error
            else
                
                render json: {errors: ["Something went wrong when saving this focus"]}, status: :internal_server_error
            end
        end
    else
        render json: {errors: ["User does not have previleges for requested action"]}, status: :forbidden
    end
  end

  def show
      if logged_in? && current_user
          @focus = Focus.find_by_id(params[:id]) 
          if @focus
              render json: {focus: @focus}, status: :ok
          else
              render json: {errors: ["focus not found"]}, status: :not_found
          end
      else
          render json: {errors: ["User does not have previleges for requested action"]}, status: :forbidden
      end
  end

  def index
      if logged_in? && current_user
          @focuses = Focus.all
          render json: {focuses: @focuses}, status: :ok
      else
          render json: {errors: ["User does not have previleges for requested action"]}, status: :forbidden
      end
  end

  def update
      @focus = Focus.find_by_id(params[:id])
      if @focus.nil?
          render json:{errors: ["no such focus found for editting"],}, status: :not_found
          return
      end
      if logged_in? && current_user && current_user.usertype == "admin"
          if @focus.update(focus_params) 
              render json: {focus: @focus}, status: :ok
          else
              render json: {errors: ["something went wrong when updating this focus"]}, status: :internal_server_error
          end
      else
          render json:{errors: ["User does not have previleges for requested action"],}, status: :forbidden
      end
  end

  def destroy
      if logged_in? && current_user && current_user.usertype == "admin"
          @focus = Focus.find_by_id(params[:id])  
          if @focus.nil?
              render json:{errors: ["no such focus found for deleting"]}, status: :not_found
              return 
          end
          if @focus.destroy 
              render json: {focus: @focus}, status: :ok
          else
              render json: {errors: ["something went wrong when deleting this focus"]}, status: :internal_server_error
          end
      else
          render json:{errors: ["User does not have previleges for requested action"],}, status: :forbidden
      end
  end

  private
  def focus_params
      params.require(:focus).permit(:focus)
  end
end
