class AboutsController < ApplicationController
    before_action :is_admin, except: [:show, :index]

    def index
        render json: {
                abouts: About.all,
                }, status: :ok
    end

    def show
        @about = About.find(params[:id])
        if @about
            render json: {
                about: @about,
               }, status: :ok
        else
            render json: {
                errors: ["Record not found on the Abouts list"],
            }, status: :not_found
        end
    end

    def new
        @about = About.new
    end


    def find
        uri = URI.parse(request.url)
        params = CGI.parse(uri.query)
        @about = nil
        puts params
        if params.key?("firstname")
            @about = About.find_by_firstname(params["firstname"])
        elsif params.key?("lastname")
            # Use this only for testing purposes as firstname-lastname pair is not guarenteed to be unique.
            @about = About.find_by lastname: params["lastname"]
        end
        if @about
            render json: {
                about: @about,
            }, status: :ok
        else
            render json: {
                    errors: ["record not found"],
                    }, status: :not_found
        end
    end

    def create
        if params["about"]["rank"] == nil
            params["about"]["rank"] == "normal"
        end
        @about = About.new(about_params)
        if @about.save
            render json: {
                about: @about,
            }, status: :created
        else
            render json: {
                errors: ["Something went wrong when creating this record"],
            }, status: :internal_server_error
        end
    end

    def edit
        # Returns an HTML form for editing a company
        @about = About.find(params[:id])
    end

    def update
        @about = About.find(params[:id])
        if @about.update(about_params)
            render json: {
                about: @about,
                }, status: :ok
        else
            render json: {
                errors: @about.errors.full_messages,
                }, status: :bad_request
        end
    end

    def destroy
        @about = About.find(params[:id])
        if @about.destroy
            render json: {
                message: "About record deleted successfuly",
            }, status: :ok
        else
            render json: {
                errors: ["Something went wrong when deleting this record"]
            }, status: :bad_request
        end
    end


    def about_params
        params.require(:about).permit(:firstname, :lastname, :imgSrc, :role, :description, :rank, :social_links)
    end
end
