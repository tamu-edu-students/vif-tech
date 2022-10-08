# spec/requests/categories_request_spec.rb
RSpec.describe 'Login', type: :request do
    # initialize test data
    let!(:test_user) { FactoryBot.create(:user) }
    #  POST /category
    describe 'POST /login' do
        let(:login_payload) { { user: { username: test_user.username, password: test_user.password } } }
      context 'Valid Login Payload' do
        before { post '/login', params: login_payload }
        it 'User can login successfuly' do
          json = JSON.parse(response.body);
          expect(json['user']).not_to eq(nil)
          expect(json['logged_in']).to eq(true)
        end
        it 'returns status code 200' do
          expect(response).to have_http_status(200)
        end
      end
    end

   end