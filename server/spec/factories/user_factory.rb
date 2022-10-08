FactoryBot.define do
    factory :user do
        username { Faker::Name.first_name }
        password { Faker::Alphanumeric.alpha(number: 10) }
        email { Faker::Internet.email }
    end
end